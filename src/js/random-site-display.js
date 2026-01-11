const sites = [
	"dimden.dev",
	"maxpixels.moe",
	"rice.place",
	"obama.nekoweb.org",
	"joo.sh",
	"housepen.nekoweb.org",
	"bonyou.nekoweb.org",
	"reigen.nekoweb.org",
	"lel.nekoweb.org",
	"july.lol",
	"layercake.moe",
	"crystal.nekoweb.org",
	"biofreak.world",
	"potentia.moe",
	"carp.nekoweb.org",
	"guh.nekoweb.org",
	"moosyu.nekoweb.org",
	"ddnikki.moe",
	"whirlwindnoa.moe",
	"jbc.lol"
];

let selectedSite = sites[Math.floor(Math.random() * sites.length)];

siteSpan = document.getElementById("random-site");
siteSpan.innerHTML = `
<a href="https://${selectedSite}"><span>${selectedSite}</span></a>
`;