DateNowJ = new Date;
YearNowJ = DateNowJ.getYear();

if ( YearNowJ < 1900 ) {
	YearNowJ = YearNowJ + 1900;
}
if ( DateNowJ.getMonth() < 5 ) {
	YearNowJ = YearNowJ - 1;
}
YearMinus1 = YearNowJ - 1;
YearMinus2 = YearNowJ - 2;
YearMinus3 = YearNowJ - 3;
YearMinus4 = YearNowJ - 4;
YearMinus5 = YearNowJ - 5;

img01on = new Image();
img01on.src = "http://image.weather.com/web/radar/us_atl_closeradar_large_usen.jpg";
img02on = new Image();
img02on.src = "http://image.weather.com/images/maps/current/se_curtemp_720x486.jpg";
img03on = new Image();
img03on.src = "http://image.weather.com/web/forecast/us_se_9regwxlo1_large_usen.jpg";
img04on = new Image();
img04on.src = "http://image.weather.com/web/forecast/us_se_9regwxhi2_large_usen.jpg";
img05on = new Image();
img05on.src = "http://image.weather.com/images/maps/forecast/se_precfcst_720x486.jpg";
img06on = new Image();
img06on.src = "http://image.weather.com/images/maps/current/cur_se_720x486.jpg";
img07on = new Image();
img07on.src = "http://www.advfn.com/p.php?pid=staticchart&s=DOWI%3AINDU&p=0&t=7&tr=1";
img08on = new Image();
img08on.src = "http://www.advfn.com/p.php?pid=staticchart&s=NASDAQI%3ACOMPX&p=0&t=7&tr=1";
img09on = new Image();
img09on.src = "http://www.advfn.com/p.php?pid=staticchart&s=SPI%3AIN%5CX&p=0&t=7&tr=1";
img11on = new Image();
img11on.src = "http://image.weather.com/images/maps/health/airquality/us_national_fcst_airquality_day1_600_en.jpg";
img12on = new Image();
img12on.src = "http://image.weather.com/images/maps/seasonal/spec_seasonal11_600_en.jpg";
img13on = new Image();
img13on.src = "http://earthquake.usgs.gov/eqcenter/recenteqsus/index.gif";
img14on = new Image();
img14on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearNowJ + "/track.gif";
img15on = new Image();
img15on.src = "http://image.weather.com/web/forecast/us_se_9regwxhi1_large_usen.jpg";
img16on = new Image();
img16on.src = "http://image.weather.com/images/maps/special/severe_se_720x486.jpg";
img17on = new Image();
img17on.src = "http://image.weather.com/web/radar/us_atl_metroradar_large_usen.jpg";
img18on = new Image();
img18on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearMinus5 + "/track.gif";
img19on = new Image();
img19on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearMinus4 + "/track.gif";
img20on = new Image();
img20on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearMinus3 + "/track.gif";
img21on = new Image();
img21on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearMinus2 + "/track.gif";
img22on = new Image();
img22on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearMinus1 + "/track.gif";
img23on = new Image();
img23on.src = "http://weather.unisys.com/hurricane/atlantic/" + YearNowJ + "/track.gif";
img24on = new Image();
img24on.src = "http://www.advfn.com/p.php?pid=staticchart&s=NYM%5ECL%5CM08&p=0&t=7&tr=1";
img25on = new Image();
img25on.src = "http://image.weather.com/images/maps/pt_BR/health/tree_pol_720x486.jpg";
img26on = new Image();
img26on.src = "http://image.weather.com/images/maps/pt_BR/health/grass_pol_720x486.jpg";
img27on = new Image();
img27on.src = "http://image.weather.com/images/maps/pt_BR/health/rag_pol_720x486.jpg";
img28on = new Image();
img28on.src = "http://image.weather.com/images/maps/pt_BR/health/mold_spore_720x486.jpg";

function imgOn( GroupJ, ImageJ ) {
	window.location.hash = "Top";
	window.location.hash = GroupJ;
	document["Img" + GroupJ].src = eval(ImageJ + "on.src");
}

function imgAOn(imgName) {
	if (document.images) {
		document["A"].src = eval(imgName + "on.src");
	}
}

function imgBOn(imgName) {
	if (document.images) {
		document["B"].src = eval(imgName + "on.src");
	}
}

function imgCOn(imgName) {
	if (document.images) {
		document["C"].src = eval(imgName + "on.src");
	}
}

function imgDOn(imgName) {
	if (document.images) {
		document["D"].src = eval(imgName + "on.src");
	}
}

function imgEOn(imgName) {
	if (document.images) {
		document["E"].src = eval(imgName + "on.src");
	}
}

function imgFOn(imgName) {
	if (document.images) {
		document["F"].src = eval(imgName + "on.src");
	}
}

function imgGOn(imgName) {
	if (document.images) {
		document["G"].src = eval(imgName + "on.src");
	}
}

