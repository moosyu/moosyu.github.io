const texts = [
  `"再来亿遍`,
  `《招惹了妒忌的狗》`,
  `欢迎来到《大唐新说唱》`,
  `再来亿遍`,
  `先收藏在MC 補檔了就收藏在動物園`,
  `湾湾也看动物园?`,
  `回复 @就这我怎么输阿 :湾湾人也爱玩抽象`,
  `很好，有种溜冰，但是冰里面带点勾氏的感觉`,
  `非常坏评论，恨来自洛阳缑氏`,
  `大肠刺身是吧`,
  `确实`,
  `10w粉 up亲自跳鲲舞[歪嘴]`,
  `再穿个女装吧要不`,
  `up准备好学汤姆老师的舞蹈课了吗`,
  `我是北极科考站的每到夏季极昼要睡觉的时候我都会打开up的视频这样马上就能眼前一黑比眼罩都好使`,
  `极你太美（北极）`,
  `广西北极科考站`,
  `回复 @一袋盐水www :初您退，极反对`,
  `蒸梅酥芝19¥`,
  `树枝要两块钱的屑（恼）`,
  `香汤艾西鱿是什么`,
  `回复 @怪物咲孩 :2.5块（指正）`,
  `[微笑][微笑]纯路人真的觉得没必要这么黑蔡徐鲲蔡徐鲲是优质偶像非常宠粉三观也超正在跑男这种真人秀综艺里面真的非常能够体现出蔡徐鲲优秀的人格特点和为人处事方式玩游戏时也不屑于使用非常手段获得游戏胜利而是通过自己已知的条件、聪明有逻辑的大胆分析，很让人佩服!人也很有礼貌,工作也认真,看到他我就可以燃起学习的热情,重拾起生活的希望,这不就是偶像的意义吗。小黑们一直黑他不就是因为羡慕他过得比自己舒服吗，拜托，他的美好生活是自己辛苦工作，无数个日夜练习唱跳才出来的，小黑子们继续黑吧，你们明天起床还是会面对一样的挣扎的生活但作为ikun的我还是会继续粉他不仅因为他给我带来的正能量帮我走出阴霾一天下一个蛋还能给我补充营养`,
  `帮转，煤老板还得加强`,
  `捕捉~`,
  `捉`,
  `我的真实想法`,
  `开头:与我的世界有关的音乐`,
  `中间:？只因你太美`,
  `结尾:[热词系列_三连]三连`,
  `只因啥呢，这不是只因你太美`,
  `哪听出来是只因你太美了假IKUN被抓到了吧`,
  `谁会去数那村民的114.514次死亡呢?`,
  `怎么哪都有homo(悲)`,
  `怎么次数还有这么臭的小数的啊（恼）`,
  `别再黑鲲鲲了，他很宠粉的，我过生日他给我下了一个蛋`,
  `我应该把它放在我的世界收藏夹还是爱坤收藏夹呢`,
  `两个都放`,
  `好建议`,
  `路人：我不放`,
  `allelujah! don't bend ascend!`,
  `>ignore africa`,
  `i dont care how hot sigmund freud's mom is`,
  `<img src="https://i.imgur.com/HHpOeDF.jpeg"  draggable="false">`,
  `<img src="https://i.imgur.com/CBbRt1E.png"  draggable="false">`,
  `<img src="https://i.imgur.com/KmooX78.png"  draggable="false">`,
  `<img src="https://i.imgur.com/bXqPNNT.gif"  draggable="false">`
];

const colours = [
  "orange",
  "yellow",
  "cyan",
  "magenta",
  "lime"
];

const container = document.getElementById("marquee-container");

function spawnMarquee() {
  const marqueeElement = document.createElement("div");
  marqueeElement.className = "marquee";
  
  marqueeElement.innerHTML = texts[Math.floor(Math.random() * texts.length)];

  const colour = colours[Math.floor(Math.random() * colours.length)];
  marqueeElement.style.color = colour;

  const containerHeight = container.clientHeight;
  marqueeElement.style.top = Math.random() * (containerHeight - 30) + "px";

  const duration = 8 + Math.random() * 6;

  container.appendChild(marqueeElement);

  const startX = container.clientWidth;
  const endX = -marqueeElement.offsetWidth;

  marqueeElement.animate(
    [
      { transform: `translateX(${startX}px)` },
      { transform: `translateX(${endX}px)` }
    ],
    {
      duration: duration * 1000,
      easing: "linear"
    }
  ).onfinish = () => {
    marqueeElement.remove();
  };
}

setInterval(spawnMarquee, 3000);