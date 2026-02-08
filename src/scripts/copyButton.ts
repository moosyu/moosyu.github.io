const tooltip = document.getElementById("tooltip-btn");
const tooltipText = document.querySelector(".tooltip-text");

tooltip.addEventListener("click", () => {
    navigator.clipboard.writeText('<a href="https://moosyu.github.io/"><img src="https://moosyu.github.io/assets/buttons/moosyu.png" alt="moosyus awesome button"></a>');
    tooltipText.textContent = "Copied";
});

tooltip.addEventListener("mouseout", () => {
    tooltipText.textContent = "Copy to clipboard";
})