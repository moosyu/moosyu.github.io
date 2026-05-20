```
extends Sprite2D

const NUM_POINTS: int = 32
const CANVAS_SIZE: int = 250
const FLAME_POINT_CLOUD: Array[Vector2] = [Vector2(61.0, 130.0), Vector2(68.15457, 148.3091), Vector2(75.0, 167.468), Vector2(82.44778, 188.0), Vector2(91.03428, 188.9657), Vector2(102.6972, 173.9542), Vector2(108.0476, 165.1401), Vector2(113.5019, 156.5254), Vector2(124.7002, 142.0283), Vector2(127.1594, 138.7769), Vector2(136.8578, 123.9272), Vector2(142.2918, 115.1915), Vector2(147.5354, 107.3939), Vector2(157.9016, 89.09734), Vector2(161.7215, 82.23737), Vector2(171.1731, 67.51935), Vector2(177.439, 57.36943), Vector2(184.0158, 45.98418), Vector2(191.7926, 32.04698), Vector2(176.8961, 42.11783), Vector2(161.3954, 48.78441), Vector2(145.764, 53.32449), Vector2(127.7603, 62.05795), Vector2(130.5208, 75.20612), Vector2(133.9171, 84.56772), Vector2(138.3506, 103.0779), Vector2(139.8735, 108.6206), Vector2(144.2247, 121.7791), Vector2(148.3955, 137.9373), Vector2(152.0314, 151.3911), Vector2(158.295, 166.489), Vector2(161.1589, 179.1736)]
const RECOGNIZER_SIZE: float = 250.0
const MATCH_THRESHOLD: float = 55.0

var image: Image
var canvas_texture: ImageTexture
var gesture_points: Array[Vector2]
var template_norm: Array[Vector2]
var template_norm_rev: Array[Vector2]

func _ready() -> void:
	GameEvents.submit_pressed.connect(_on_submit_pressed)
	image = Image.create_empty(CANVAS_SIZE, CANVAS_SIZE, false, Image.FORMAT_RGBA8)
	image.fill(Color.WHITE)
	canvas_texture = ImageTexture.create_from_image(image)
	texture = canvas_texture
	position = get_viewport().get_visible_rect().size / 2
	template_norm = normalize_points(FLAME_POINT_CLOUD)
	
	# so it isnt direction specific
	var reversed: Array[Vector2] = FLAME_POINT_CLOUD.duplicate()
	reversed.reverse()
	template_norm_rev = normalize_points(reversed)

func paint_texture(pos: Vector2i, paint_color: Color) -> void:
	image.fill_rect(Rect2i(pos, Vector2i(1,1)).grow(3), paint_color)

func _input(event: InputEvent) -> void:
	var local_pos = to_local(event.position)
	if !get_rect().has_point(local_pos): return

	if Input.is_action_just_pressed("left_click"):
		image.fill(Color.WHITE)
		gesture_points.clear()
		var pos = to_local(event.position)
		var impos = pos + get_rect().size / 2.0
		paint_texture(impos, Color.BLACK)
		gesture_points.append(impos)
		canvas_texture.update(image)
	elif event is InputEventMouseMotion:
		if Input.is_action_pressed("left_click"):
			var pos: Vector2 = to_local(event.position)
			var impos: Vector2 = pos + get_rect().size / 2.0
			paint_texture(impos, Color.BLACK)
			canvas_texture.update(image)
			if event.relative.length_squared() > 0:
				var num = ceili(event.relative.length())
				var target_pos = impos - (event.relative)
				for i in num:
					impos = impos.move_toward(target_pos, 1)
					paint_texture(impos, Color.BLACK)
					gesture_points.append(impos)

func _on_submit_pressed() -> void:
	if recognizable():
		print("success")
	else:
		print("fail")

func recognizable() -> bool:
	if gesture_points.size() < 2:
		return false

	var candidate_norm: Array[Vector2] = normalize_points(gesture_points)
	var distance_forward: float = path_distance(candidate_norm, template_norm)
	var distance_reverse: float = path_distance(candidate_norm, template_norm_rev)
	var best_distance: float = min(distance_forward, distance_reverse)

	print(best_distance)
	return best_distance <= MATCH_THRESHOLD

func normalize_points(points: Array[Vector2]) -> Array[Vector2]:
	var resampled = resample(points)
	var rotated = rotate_to_zero(resampled)
	var scaled = scale_to_square(rotated, RECOGNIZER_SIZE)
	var centered_point  = translate_to_origin(scaled)
	return centered_point

func resample(points: Array[Vector2]) -> Array[Vector2]:
	if points.size() < 2:
		return points.duplicate()
	var arc: Array[float] = [0.0]
	for i in range(1, points.size()):
		arc.append(arc[i - 1] + points[i].distance_to(points[i - 1]))
	var total_len: float = arc.back()
	if total_len == 0.0:
		var temp_points: Array[Vector2]
		for point in NUM_POINTS:
			temp_points.append(points[0])
		return temp_points

	var result: Array[Vector2] = [points[0]]
	for i in NUM_POINTS - 1:
		var target_distance: float = i * total_len / (NUM_POINTS - 1)
		var low: float = 0
		var high: float = arc.size() - 1
		while high - low > 1:
			var mid: float = (low + high) / 2
			if arc[mid] <= target_distance:
				low = mid
			else:
				high = mid
		var segment_length: float = arc[high] - arc[low]
		var t: float = 0.0 if segment_length == 0.0 else (target_distance - arc[low]) / segment_length
		result.append(points[low].lerp(points[high], t))
	return result

func rotate_to_zero(points: Array[Vector2]) -> Array[Vector2]:
	var c: Vector2 = centroid(points)
	var angle: float = atan2(points[0].y - c.y, points[0].x - c.x)
	return rotate_by(points, -angle, c)

func rotate_by(points: Array[Vector2], angle: float, center: Vector2) -> Array[Vector2]:
	var cos_a: float = cos(angle)
	var sin_a: float = sin(angle)
	var temp_points: Array[Vector2]
	for point in points:
		var q: Vector2 = point - center
		temp_points.append(Vector2(q.x * cos_a - q.y * sin_a, q.x * sin_a + q.y * cos_a) + center)
	return temp_points

#func bounding_box(points: Array[Vector2]) -> 

func scale_to_square(points: Array[Vector2], size: float) -> Array[Vector2]:
	var min_x: float = points[0].x
	var max_x: float = points[0].x
	var min_y: float = points[0].y
	var max_y: float = points[0].y
	for point in points:
		min_x = min(min_x, point.x)
		max_x = max(max_x, point.x)
		min_y = min(min_y, point.y)
		max_y = max(max_y, point.y)

	var width: float = max_x - min_x
	var height: float = max_y - min_y
	var scale_factor = size / max(width, height)
	var temp_points: Array[Vector2]
	for point in points:
		temp_points.append(Vector2((point.x - min_x) * scale_factor, (point.y - min_y) * scale_factor))
	return temp_points

func translate_to_origin(points: Array[Vector2]) -> Array[Vector2]:
	var center: Vector2 = centroid(points)
	var temp_points: Array[Vector2]
	for point in points:
		temp_points.append(point - center)
	return temp_points

func path_distance(point_a: Array[Vector2], point_b: Array[Vector2]) -> float:
	var total: float = 0.0
	var n = min(point_a.size(), point_b.size())
	for i in n:
		total += point_a[i].distance_to(point_b[i])
	return total / n

func centroid(points: Array[Vector2]) -> Vector2:
	# https://stackoverflow.com/questions/12840839/find-the-center-point-of-coordinate-2d-array-c-sharp
	var sum: Vector2 = Vector2.ZERO
	for point in points:
		sum += point
	return sum / points.size()
```