// General Clock Values
clockWidth = 200;
clockHeight = 200;
clockWidthCenter = clockWidth / 2;
clockHeightCenter = clockHeight / 2;
clockDialLineWidth = 0.5;
clockDiskRadius = 5;
clockDiskColor = "black";
clockHandsColor = "black";
clockHourLength = 55;
clockHourHalfWidth = 4.5;
clockMinuteLength = 80;
clockMinuteHalfWidth = 3;
clockSecondLength = 95;
clockSecondHalfWidth = 1;
clockHandPointOfMaxWidth = 8;
clockHandColor = "black";
clockNumberFont = "30px Times New Roman";
clockNumberPixelOffset = 2;		// Fixes Firefox; breaks Chrome and Explorer
clockNumberFromCenter = 80;
clockNumberLineWidth = 0.5;
clockNumberScale = 0.75;
clockCornerTextFont = "11px Arial";
clockRangeArcLineWidth = 10;
clockTickMarksInnerLimit = 68;
clockTickMarksOuterLimit = 93;

// Identify daylight saving time offsets
Date.prototype.stdTimezoneOffset = function() {
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

// Identify if the current date is on daylight saving time
Date.prototype.dst = function() {
	return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

function componentBackground(objClock, xCenterJ, yCenterJ, radiusJ, clockWidth, clockHeight) {
	
	objGradient = objClockStandard.createRadialGradient( xCenterJ, yCenterJ, 0, xCenterJ, yCenterJ, radiusJ * 1.42 );
	objGradient.addColorStop( 0.1, "white" );
	objGradient.addColorStop( 0.9, "rgba( 150, 112, 78, 1 )");
	
	objClock.fillStyle = objGradient;
	objClock.fillRect( -(clockWidth/2), -(clockHeight/2), clockWidth, clockHeight );
}

function componentOuterCircle(objClock, radiusJ, lineWidth) {
	
	objClock.lineWidth = lineWidth;
	objClock.beginPath();
	objClock.arc( 0, 0, radiusJ, 0, Math.PI * 2, true );
	objClock.stroke();

}

function componentDisk(objClock, radiusJ, colorJ) {
	
	objClock.beginPath();
	objClock.arc( 0, 0, radiusJ, 0, Math.PI * 2, true );
	objClock.fillStyle = colorJ;
	objClock.fill();
	
}

function componentNumbers(objClock, arrayNumbers, lineWidth, font, pixelOffset, strokeStyle, fillStyle, scale) {
	
	objClock.lineWidth = lineWidth;
	objClock.font = font;
	if (strokeStyle != "") {
		objClock.strokeStyle = strokeStyle;
	}
	if (fillStyle != "") {
		objClock.fillStyle = fillStyle;
	}
	objClock.textAlign = "center";
	objClock.textBaseline = "middle";
	numberOfNumbers = arrayNumbers.length;
	for (i=0; i<numberOfNumbers; i++) {
		rotationNotch = i + 1;
		objClock.rotate( rotationNotch * Math.PI * 2 / numberOfNumbers );
		objClock.translate( 0, -clockNumberFromCenter );
		objClock.rotate( rotationNotch * -1 * Math.PI * 2 / numberOfNumbers );
		objClock.beginPath();
		objClock.scale( scale, 1 );
		objClock.translate( 0, pixelOffset );
		if (strokeStyle != "") {
			objClock.strokeText( arrayNumbers[i], 0, 0 );
		}
		if (fillStyle != "") {
			objClock.fillText( arrayNumbers[i], 0, 0 );
		}
		objClock.translate( 0, -pixelOffset );
		objClock.scale( ( 1/scale) , 1 );
		objClock.rotate( rotationNotch * Math.PI * 2 / numberOfNumbers );
		objClock.translate( 0, clockNumberFromCenter );
		objClock.rotate( rotationNotch * -1 * Math.PI * 2 / numberOfNumbers );
	}

}

function componentHand(objClock, degrees, handHalfWidth, handPointOfMaxWidth, handLength, handColor ) {
	
	objClock.beginPath();
	objClock.rotate( degrees * Math.PI / 180 );
	objClock.moveTo( 0, 0 );
	objClock.lineTo( -handHalfWidth, -handPointOfMaxWidth );
	objClock.lineTo( 0, -handLength );
	objClock.lineTo( handHalfWidth, -handPointOfMaxWidth );
	objClock.closePath();
	objClock.fillStyle = handColor;
	objClock.fill();
	objClock.rotate( -degrees * Math.PI / 180 );

}

function componentCornerText(objClock, displayText, corner, font, clockHalfWidth, clockHalfHeight, colorJ, vertOffsetJ ) {

	if ( typeof(vertOffsetJ) == "undefined" ) {
		vertOffsetNumJ = 0;
	} else {
		vertOffsetNumJ = vertOffsetJ;
	}
	objClock.font = font;
	objClock.textBaseline = "middle";
	if ( corner.toUpperCase() == "TR" || corner.toUpperCase() == "BR" ) {
		// Right wall items
		objClock.textAlign = "right";
		xLocation = clockHalfWidth-3;
	} else {
		// Left wall items
		objClock.textAlign = "left";
		xLocation = -clockHalfWidth+3;
	}
	if ( corner.toUpperCase() == "TL" || corner.toUpperCase() == "TR" ) {
		// Top wall items
		objClock.textBaseline = "top";
		yLocation = -clockHalfHeight;
	} else {
		// Bottom wall items
		objClock.textBaseline = "bottom";
		yLocation = clockHalfHeight;
	}
	if ( typeof( colorJ ) == "undefined" ) {
		objClock.fillStyle = "black";
	} else
	{
		objClock.fillStyle = colorJ;
	}
	objClock.fillText( displayText, xLocation, yLocation + vertOffsetNumJ );
}

function componentRangeArcCalc( objClock, activeColorJ, inactiveColorJ, separatorColorJ, startDegreeJ, endDegreeJ, hourDegreesJ, radiusToEdge, lineWidth ) {

	if ( endDegreeJ < startDegreeJ ) {
		testEndDegreeJ = endDegreeJ + 360;
	} else {
		testEndDegreeJ = endDegreeJ;
	}
	if ( ( hourDegreesJ >= startDegreeJ && hourDegreesJ <= testEndDegreeJ ) || ( ( hourDegreesJ + 360 ) >= startDegreeJ && ( hourDegreesJ + 360 ) <= testEndDegreeJ ) ) {
		objClock.strokeStyle = activeColorJ;		
	} else {
		objClock.strokeStyle = inactiveColorJ;		
	}
	objClock.lineWidth = lineWidth;
	arcRadius = radiusToEdge - ( lineWidth / 2 );
	objClock.rotate( Math.PI / -2 );
	objClock.beginPath();
	objClock.arc( 0, 0, arcRadius, startDegreeJ * Math.PI / 180, endDegreeJ * Math.PI / 180, false );
	objClock.stroke();
	objClock.strokeStyle = separatorColorJ;
	objClock.beginPath();
	objClock.arc( 0, 0, arcRadius, startDegreeJ * Math.PI / 180, ( startDegreeJ + 0.5 ) * Math.PI / 180, false );
	objClock.stroke();
	objClock.beginPath();
	objClock.arc( 0, 0, arcRadius, endDegreeJ * Math.PI / 180, ( endDegreeJ + 0.5 ) * Math.PI / 180, false );
	objClock.stroke();
	objClock.rotate( Math.PI / 2 );

}

function componentRangeArc( objClock, colorJ, startDegreeJ, endDegreeJ, radiusToEdge, lineWidth ) {

	if ( endDegreeJ < startDegreeJ ) {
		testEndDegreeJ = endDegreeJ + 360;
	} else {
		testEndDegreeJ = endDegreeJ;
	}
	objClock.strokeStyle = colorJ;		
	objClock.lineWidth = lineWidth;
	arcRadius = radiusToEdge - ( lineWidth / 2 );
	objClock.rotate( Math.PI / -2 );
	objClock.beginPath();
	objClock.arc( 0, 0, arcRadius, startDegreeJ * Math.PI / 180, endDegreeJ * Math.PI / 180, false );
	objClock.stroke();
	objClock.rotate( Math.PI / 2 );

}

function componentRangeArcText( objClock, textJ, colorJ, fontJ, startDegreeJ, endDegreeJ ) {

	if ( endDegreeJ < startDegreeJ ) {
		testEndDegreeJ = endDegreeJ + 360;
	} else {
		testEndDegreeJ = endDegreeJ;
	}
	targetDegreesJ = ( startDegreeJ + testEndDegreeJ ) / 2;
	targetDegreesJ = targetDegreesJ % 360;
	objClock.textAlign = "center";
	objClock.textBaseline = "middle";
	objClock.fillStyle = colorJ;
	objClock.font = fontJ;
	if ( targetDegreesJ <= 180 ) {
		objClock.rotate( ( Math.PI / -2 ) + ( targetDegreesJ * Math.PI / 180 ) );
		objClock.fillText( textJ, 40, 0 );
		objClock.rotate( ( Math.PI / 2 ) - ( targetDegreesJ * Math.PI / 180 ) );
	} else {
		objClock.rotate( ( Math.PI / -2 ) + ( ( targetDegreesJ - 180 ) * Math.PI / 180 ) );
		objClock.fillText( textJ, -40, 0 );
		objClock.rotate( ( Math.PI / 2 ) - ( ( targetDegreesJ - 180 ) * Math.PI / 180 ) );
	}

}

function tickMarks( objClock, numberOfTicks, offsetDegrees, innerLimit, outerLimit, color, lineWidth ) {
	objClock.lineWidth = lineWidth;
	objClock.strokeStyle = color;
	objClock.rotate( Math.PI * -1 );
	objClock.rotate( offsetDegrees * ( Math.PI / 180 ) );
	for (i=0; i<numberOfTicks; i++) {
		rotationNotch = i + 1;
		objClock.rotate( rotationNotch * Math.PI * 2 / numberOfTicks );
		objClock.beginPath();
		objClock.moveTo( 0, innerLimit );
		objClock.lineTo( 0, outerLimit );
		objClock.stroke();
		objClock.rotate( rotationNotch * -1 * Math.PI * 2 / numberOfTicks );
	}
	objClock.rotate( -offsetDegrees * ( Math.PI / 180 ) );
	objClock.rotate( Math.PI );
}

function calculateStandardClock( canvasID ) {
	time=new Date(); // time object
	seconds = time.getSeconds();
	minutes = time.getMinutes();
	hours = time.getHours();
	
	displayTextJ = hours == 0 ? 12 : hours % 12;
	displayTextJ = displayTextJ + ":" + twoDigitNum( minutes ) + ":" + twoDigitNum( seconds ) + " ";
	if ( hours == 12 && minutes == 0 && seconds == 0 ) {
		displayTextJ = displayTextJ + "N"
	} else if ( ( hours == 0 || hours == 23 ) && minutes == 0 && seconds == 0 ) {
		displayTextJ = displayTextJ + "M"
	} else if ( hours > 12 && hours < 24 ) {
		displayTextJ = displayTextJ + "PM"
	} else {
		displayTextJ = displayTextJ + "AM"
	}
	displayText24J = hours + ":" + twoDigitNum( minutes ) + ":" + twoDigitNum( seconds );
	
	hours = hours + (minutes/60) + (seconds/3600);
	minutes = minutes + (seconds/60);
	
	secondDegreesJ = seconds*6; // calculating seconds
	minuteDegreesJ = minutes*6; // calculating minutes
	hourDegreesJ = hours*30; // calculating hours

	drawStandardClock( canvasID, hourDegreesJ, minuteDegreesJ, secondDegreesJ, displayTextJ, displayText24J );
}

function drawStandardClock( canvasID, hourDegreesJ, minuteDegreesJ, secondDegreesJ, displayTextJ, displayText24J ) {

	objClockStandard = document.getElementById(canvasID).getContext('2d');

	// Move from top-left corner to center
	objClockStandard.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClockStandard, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClockStandard, clockHeightCenter-1, clockDialLineWidth);
	// Center Disk
	componentDisk(objClockStandard, clockDiskRadius, clockDiskColor);
	// Numbers
	arrayNumbers = new Array();
	for (i=0; i<12; i++) {
		arrayNumbers[i] = i+1;
	}
	componentNumbers(objClockStandard, arrayNumbers, clockNumberLineWidth, clockNumberFont, clockNumberPixelOffset, "black", "", clockNumberScale);
	// Hour Hand
	componentHand(objClockStandard, hourDegreesJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockHandColor );
	// Minute Hand
	componentHand(objClockStandard, minuteDegreesJ, clockMinuteHalfWidth, clockHandPointOfMaxWidth, clockMinuteLength, clockHandColor );
	// Second Hand
	componentHand(objClockStandard, secondDegreesJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, clockHandColor );
	// Display Time
	componentCornerText(objClockStandard, displayTextJ, "BL", "9px Arial", clockWidthCenter, clockHeightCenter)
	componentCornerText(objClockStandard, displayText24J, "BR", "9px Arial", clockWidthCenter, clockHeightCenter)
	// Back to top-left corner
	objClockStandard.translate( -clockWidthCenter, -clockHeightCenter );

}

function calculate24HourClock( canvasID ) {
	time=new Date(); // time object
	seconds = time.getSeconds();
	minutes = time.getMinutes();
	hours = time.getHours();
	
	displayTextJ = hours + ":" + twoDigitNum( minutes ) + ":" + twoDigitNum( seconds );

	hours = hours + (minutes/60) + (seconds/3600);
	minutes = minutes + (seconds/60);
	
	secondDegreesJ = seconds*6; // calculating seconds
	minuteDegreesJ = minutes*6; // calculating minutes
	hourDegreesJ = hours*15; // calculating hours
	
	draw24HourClock( canvasID, time, hourDegreesJ, minuteDegreesJ, secondDegreesJ, displayTextJ );
}

function draw24HourClock( canvasID, dateJ, hourDegreesJ, minuteDegreesJ, secondDegreesJ, displayTextJ ) {

	objClock24Hour = document.getElementById(canvasID).getContext('2d');

	// Move from top-left corner to center
	objClock24Hour.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClock24Hour, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClock24Hour, clockHeightCenter-1, clockDialLineWidth);
	// Center Disk
	componentDisk(objClock24Hour, clockDiskRadius, clockDiskColor);
	// Numbers
	arrayNumbers = new Array();
	for (i=0; i<24; i++) {
		arrayNumbers[i] = i+1;
	}
	componentNumbers(objClock24Hour, arrayNumbers, clockNumberLineWidth, "20px Times New Roman", clockNumberPixelOffset, "black", "", clockNumberScale);
	// Hour Hand
	componentHand(objClock24Hour, hourDegreesJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockHandColor );
	// Minute Hand
	componentHand(objClock24Hour, minuteDegreesJ, clockMinuteHalfWidth, clockHandPointOfMaxWidth, clockMinuteLength, clockHandColor );
	// Second Hand
	componentHand(objClock24Hour, secondDegreesJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, clockHandColor );
	// Display Time
	componentCornerText(objClock24Hour, displayTextJ, "BL", clockCornerTextFont, clockWidthCenter, clockHeightCenter)
	// Back to top-left corner
	objClock24Hour.translate( -clockWidthCenter, -clockHeightCenter );

}

function twoDigitNum( numberJ ) {
	resultJ = numberJ + "";
	if ( resultJ.length == 1 ) {
		resultJ = "0" + resultJ;
	}
	return resultJ;
}

function CalculateJewishClock( canvasID ) {

	// Pre-populate with Atlanta settings.
	LatitudeJ = 33.780;
	LongitudeJ = -84.300;
	TimeZoneJ = -5;
	
	d = new Date();
	YearJ = d.getFullYear();
	MonthJ = d.getMonth();
	DateJ = d.getDate();
	HourJ = d.getHours();
	MinuteJ = d.getMinutes();
	SecondJ = d.getSeconds();
	MillisecondJ = d.getMilliseconds();

	DSTJ = d.dst() ? 1 : 0;		// 1 = daylight saving time; 0 = standard time

	PrevSunsetJ = sunset(LatitudeJ, LongitudeJ, YearJ, MonthJ+1, DateJ-1, TimeZoneJ, DSTJ)-1;
	SunriseJ = sunrise(LatitudeJ, LongitudeJ, YearJ, MonthJ+1, DateJ, TimeZoneJ, DSTJ);
	SunsetJ = sunset(LatitudeJ, LongitudeJ, YearJ, MonthJ+1, DateJ, TimeZoneJ, DSTJ);
	NextSunriseJ = sunrise(LatitudeJ, LongitudeJ, YearJ, MonthJ+1, DateJ+1, TimeZoneJ, DSTJ)+1;
	NowJ = ((MillisecondJ) + (SecondJ * 1000) + (MinuteJ * 60 * 1000) + (HourJ * 60 * 60 * 1000)) / 86400000;
	
	// Traditionally in the Jewish calendar, 6:00 AM is at sunrise, and 6:00 PM is at sunset.
	// If the sun is up, calculation range is sunrise (BeginJ) to sunset (EndJ).
	if ((NowJ >= SunriseJ) && (NowJ < SunsetJ))
		{
			BeginJ = SunriseJ;
			EndJ = SunsetJ;
		}
	// If before sunrise, calculation range is previous sunset (BeginJ) to sunrise (EndJ).
	else if (NowJ < SunriseJ)
		{
			BeginJ = PrevSunsetJ;
			EndJ = SunriseJ;
		}
	// If after sunset, calculation range is sunset (BeginJ) to next sunrise (EndJ).
	else
		{
			BeginJ = SunsetJ;
			EndJ = NextSunriseJ;
		}
	// PeriodDifferenceJ is the fraction of the day falling in the calculation range.
	PeriodDifferenceJ = EndJ - BeginJ;
	// LengthOfHoursJ is 1/12 of PeriodDifferenceJ.
	LengthOfHoursJ = PeriodDifferenceJ / 12;
	// PortionElapsedJ is the difference between the current time and the beginning of the calculation range.
	PortionElapsedJ = NowJ - BeginJ;
	// HoursJ is the rotation of the hour hand (add 6) because periods begin at 6:00.
	HoursJ = (PortionElapsedJ / LengthOfHoursJ) + 6;
	if (Math.floor(HoursJ) >= 12)
		{
			HoursJ = HoursJ - 12;
		}
	if (Math.floor(HoursJ) == 0)
		{
			HoursJ = HoursJ + 12;
		}
	HourRotationJ = HoursJ * 30;
	// Halakim (singular "Halek") are the 1,080 parts of an hour.
	HalakimJ = Math.floor(1080 * (HoursJ - Math.floor(HoursJ)));
	HalakimRotationJ = (HalakimJ / 1080) * 360;
	
	DisplayEnglishText = Math.floor(HoursJ) + "h " + HalakimJ + "p";
	
	DisplayHebrewText = HebrewNumberJ(Math.floor(HoursJ)) + " - " + HebrewNumberJ(HalakimJ);
	
	drawJewishClock( canvasID, HourRotationJ, HalakimRotationJ, DisplayEnglishText, DisplayHebrewText );

}

function drawJewishClock( canvasID, HourRotationJ, HalakimRotationJ, DisplayEnglishText, DisplayHebrewText ) {

	objClockJewish = document.getElementById(canvasID).getContext('2d');

	// Move from top-left corner to center
	objClockJewish.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClockJewish, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClockJewish, clockHeightCenter-1, clockDialLineWidth);
	// Center Disk
	componentDisk(objClockJewish, clockDiskRadius, clockDiskColor);
	// Numbers
	arrayNumbers = new Array("א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב" );
	componentNumbers(objClockJewish, arrayNumbers, clockNumberLineWidth, clockNumberFont, clockNumberPixelOffset, "black", "", clockNumberScale);
	// Hour Hand
	componentHand(objClockJewish, HourRotationJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockHandColor );
	// Halakim Hand
	componentHand(objClockJewish, HalakimRotationJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, clockHandColor );
	// Display English Text
	componentCornerText(objClockJewish, DisplayEnglishText, "BL", clockCornerTextFont, clockWidthCenter, clockHeightCenter)
	// Display Hebrew Text
	componentCornerText(objClockJewish, DisplayHebrewText, "BR", clockCornerTextFont, clockWidthCenter, clockHeightCenter)
	// Back to top-left corner
	objClockJewish.translate( -clockWidthCenter, -clockHeightCenter );
}

function HebrewNumberJ(OriginalNumberJ)
	{
		DigUnitsJ = new Array("", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט");
		DigTensJ = new Array("", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ");
		DigTensFinalJ = new Array("", "", "ך", "", "ם", "ן", "", "", "ף", "ץ")
		DigHundredsJ = new Array("", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק");

		Gershayim = "״";
		Geresh = "׳";
		
		NumThousandJ = Math.floor(OriginalNumberJ / 1000);
		NumHundredJ = Math.floor(OriginalNumberJ / 100) - (NumThousandJ * 10);
		NumTenJ = Math.floor(OriginalNumberJ / 10) - ((NumThousandJ * 100) + (NumHundredJ * 10));
		NumUnitJ = Math.floor(OriginalNumberJ) - ((NumThousandJ * 1000) + (NumHundredJ * 100) + (NumTenJ * 10));
		
		ThousandsPartJ = "";
		HundredsTensUnitsPartJ = "";
		
		if (NumThousandJ != 0)
			{
				ThousandsPartJ = DigUnitsJ[NumThousandJ] + Geresh;
			}
		
		HundredsTensUnitsPartJ = DigHundredsJ[NumHundredJ] + DigTensJ[NumTenJ] + DigUnitsJ[NumUnitJ] + "";
		HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.replace("יה", "טו");
		HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.replace("יו", "טז");
		
		LengthOfHundredsTensUnitsPartJ = HundredsTensUnitsPartJ.length;

		switch (HundredsTensUnitsPartJ.substr(LengthOfHundredsTensUnitsPartJ - 1, 1))
			{
				case DigTensJ[2]:
					HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.substr(0, LengthOfHundredsTensUnitsPartJ - 1) + DigTensFinalJ[2];
					break;
				case DigTensJ[4]:
					HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.substr(0, LengthOfHundredsTensUnitsPartJ - 1) + DigTensFinalJ[4];
					break;
				case DigTensJ[5]:
					HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.substr(0, LengthOfHundredsTensUnitsPartJ - 1) + DigTensFinalJ[5];
					break;
				case DigTensJ[8]:
					HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.substr(0, LengthOfHundredsTensUnitsPartJ - 1) + DigTensFinalJ[8];
					break;
				case DigTensJ[9]:
					HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.substr(0, LengthOfHundredsTensUnitsPartJ - 1) + DigTensFinalJ[9];
					break;
			}
		
		if (LengthOfHundredsTensUnitsPartJ == 1)
			{
				HundredsTensUnitsPartJ = HundredsTensUnitsPartJ + Geresh;
			}
		if (LengthOfHundredsTensUnitsPartJ > 1)
			{
				HundredsTensUnitsPartJ = HundredsTensUnitsPartJ.substr(0, LengthOfHundredsTensUnitsPartJ - 1) + Gershayim + HundredsTensUnitsPartJ.substr(LengthOfHundredsTensUnitsPartJ - 1, 1);
			}
		
		NumberResultJ = ThousandsPartJ + " " + HundredsTensUnitsPartJ;
		NumberResultJ = NumberResultJ.replace(/^\s+|\s+$/g, "");
		return NumberResultJ;
	}

function calculateIslamicClock( canvasID ) {
	time=new Date(); // time object
	seconds = time.getSeconds();
	minutes = time.getMinutes();
	hours = time.getHours();
	
	hours = hours + (minutes/60) + (seconds/3600);
	minutes = minutes + (seconds/60);
	
	secondDegreesJ = seconds*6; // calculating seconds
	minuteDegreesJ = minutes*6; // calculating minutes
	hourDegreesJ = hours*15; // calculating hours

	drawIslamicClock( canvasID, time, hourDegreesJ, minuteDegreesJ, secondDegreesJ );
}

function drawIslamicClock( canvasID, dateJ, hourDegreesJ, minuteDegreesJ, secondDegreesJ ) {

	objClockIslamic = document.getElementById(canvasID).getContext('2d');

	// Pre-populate with Atlanta settings.
	LatitudeJ = 33.780;
	LongitudeJ = -84.300;
	TimeZoneJ = -5;
	DSTJ = dateJ.dst() ? 1 : 0;		// 1 = daylight saving time; 0 = standard time

	// Get prayer times
	today = dateJ; // today
	tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
	calcTimesToday = prayTimes.getTimes(today, [LatitudeJ, LongitudeJ], TimeZoneJ, DSTJ, "Float");
	calcTimesTomorrow = prayTimes.getTimes(tomorrow, [LatitudeJ, LongitudeJ], TimeZoneJ, DSTJ, "Float");

	maghribBegin = calcTimesToday.maghrib;
	maghribEnd = calcTimesToday.isha;
	degreesMaghribBegin = decimalToDegrees( maghribBegin );
	degreesMaghribEnd = decimalToDegrees( maghribEnd );

	ishaBegin = calcTimesToday.isha;
	ishaEnd1 = calcTimesToday.isha + ( ( 24 + calcTimesTomorrow.fajr ) - calcTimesToday.isha ) / 3;
	ishaEnd2 = 24 + calcTimesToday.fajr;
	degreesIshaBegin = decimalToDegrees( ishaBegin );
	degreesIshaEnd1 = decimalToDegrees( ishaEnd1 );
	degreesIshaEnd2 = decimalToDegrees( ishaEnd2 );
	
	fajrBegin = calcTimesToday.fajr;
	fajrEnd = calcTimesToday.sunrise;
	degreesFajrBegin = decimalToDegrees( fajrBegin );
	degreesFajrEnd = decimalToDegrees( fajrEnd );
	
	dhuhrBegin = calcTimesToday.dhuhr;
	dhuhrEnd = calcTimesToday.asr;
	degreesDhuhrBegin = decimalToDegrees( dhuhrBegin );
	degreesDhuhrEnd = decimalToDegrees( dhuhrEnd );
	
	asrBegin = calcTimesToday.asr;
	asrEnd = calcTimesToday.sunset;
	degreesAsrBegin = decimalToDegrees( asrBegin );
	degreesAsrEnd = decimalToDegrees( asrEnd );

/*
prayerPeriodDiagnostic = "hourDegreesJ: " +  hourDegreesJ + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesIshaBegin: " + degreesIshaBegin + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesIshaEnd1: " + degreesIshaEnd1 + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesIshaEnd2: " + degreesIshaEnd2 + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesFajrBegin: " + degreesFajrBegin + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesFajrEnd: " + degreesFajrEnd + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesDhuhrBegin: " + degreesDhuhrBegin + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesDhuhrEnd: " + degreesDhuhrEnd + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesAsrBegin: " + degreesAsrBegin + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesAsrEnd: " + degreesAsrEnd + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesMaghribBegin: " + degreesMaghribBegin + "\n";
prayerPeriodDiagnostic = prayerPeriodDiagnostic + "degreesMaghribEnd: " + degreesMaghribEnd + "\n";
alert( prayerPeriodDiagnostic );
*/
	currOrNextColor = "darkgreen";
	if ( degreesIshaEnd1 < degreesIshaEnd2 && hourDegreesJ <= degreesIshaEnd1 ) {
		currOrNextName = "عشاء‎";
		currOrNextTime = decimalToTime( degreesIshaBegin ) + "-" + decimalToTime( degreesIshaEnd1 );
	} else if ( hourDegreesJ <= degreesIshaEnd2 ) {
		currOrNextName = "عشاء‎";
		currOrNextTime = decimalToTime( degreesIshaBegin ) + "-" + decimalToTime( degreesIshaEnd2 );
		currOrNextColor = "black";
	} else if ( hourDegreesJ <= degreesFajrEnd ) {
		currOrNextName = "فجر‎";
		currOrNextTime = decimalToTime( degreesFajrBegin ) + "-" + decimalToTime( degreesFajrEnd );
	} else if ( hourDegreesJ <= degreesDhuhrBegin ) {
		currOrNextName = "ظهر‎";
		currOrNextTime = decimalToTime( degreesDhuhrBegin );
		currOrNextColor = "black";
	} else if ( hourDegreesJ <= degreesDhuhrEnd ) {
		currOrNextName = "ظهر‎";
		currOrNextTime = decimalToTime( degreesDhuhrBegin ) + "-" + decimalToTime( degreesDhuhrEnd );
	} else if ( hourDegreesJ <= degreesAsrEnd ) {
		currOrNextName = "عصر‎";
		currOrNextTime = decimalToTime( degreesAsrBegin ) + "-" + decimalToTime( degreesAsrEnd );
	} else if ( hourDegreesJ <= degreesMaghribEnd ) {
		currOrNextName = "مغرب‎";
		currOrNextTime = decimalToTime( degreesMaghribBegin ) + "-" + decimalToTime( degreesMaghribEnd );
	} else if ( degreesIshaEnd1 > degreesIshaEnd2 && hourDegreesJ <= degreesIshaEnd1 ) {
		currOrNextName = "عشاء‎";
		currOrNextTime = decimalToTime( degreesIshaBegin ) + "-" + decimalToTime( degreesIshaEnd1 );
	} else if ( degreesIshaEnd1 > degreesIshaEnd2 && hourDegreesJ > degreesIshaEnd1 ) {
		currOrNextName = "عشاء‎";
		currOrNextTime = decimalToTime( degreesIshaBegin ) + "-" + decimalToTime( degreesIshaEnd2 );
		currOrNextColor = "black";
	} else if ( degreesIshaEnd1 < degreesIshaEnd2 && hourDegreesJ > degreesMaghribEnd ) {
		currOrNextName = "عشاء‎";
		currOrNextTime = decimalToTime( degreesIshaBegin ) + "-" + decimalToTime( degreesIshaEnd1 );
	}

	// Move from top-left corner to center
	objClockIslamic.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClockIslamic, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClockIslamic, clockHeightCenter-1, clockDialLineWidth);
	// Center Disk
	componentDisk(objClockIslamic, clockDiskRadius, clockDiskColor);
	// Numbers
	arrayNumbers = new Array("١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١", "١٢", "١٣", "١٤", "١٥", "١٦", "١٧", "١٨", "١٩", "٢٠", "٢١", "٢٢", "٢٣", "٢٤");
	componentNumbers(objClockIslamic, arrayNumbers, clockNumberLineWidth, "20px Times New Roman", clockNumberPixelOffset, "black", "", clockNumberScale);
	// Range Arcs
	activeColorJ = "green";
	nightColorJ = "dimgray";
	twilightColorJ = "gray";
	dayColorJ = "darkgray";	// ironically, "darkgray" is lighter than "gray"
	separatorColorJ = "black";
	componentRangeArcCalc( objClockIslamic, activeColorJ, nightColorJ, "", degreesIshaBegin, degreesIshaEnd1, hourDegreesJ, clockHeightCenter-1, clockRangeArcLineWidth )
	componentRangeArcCalc( objClockIslamic, activeColorJ, nightColorJ, "", degreesIshaBegin, degreesIshaEnd2, hourDegreesJ, clockHeightCenter-1, 4 )
	componentRangeArcCalc( objClockIslamic, activeColorJ, twilightColorJ, separatorColorJ, degreesMaghribBegin, degreesMaghribEnd, hourDegreesJ, clockHeightCenter-1, clockRangeArcLineWidth )
	componentRangeArcCalc( objClockIslamic, activeColorJ, twilightColorJ, separatorColorJ, degreesFajrBegin, degreesFajrEnd, hourDegreesJ, clockHeightCenter-1, clockRangeArcLineWidth )
	componentRangeArcCalc( objClockIslamic, activeColorJ, dayColorJ, separatorColorJ, degreesDhuhrBegin, degreesDhuhrEnd, hourDegreesJ, clockHeightCenter-1, clockRangeArcLineWidth )
	componentRangeArcCalc( objClockIslamic, activeColorJ, dayColorJ, separatorColorJ, degreesAsrBegin, degreesAsrEnd, hourDegreesJ, clockHeightCenter-1, clockRangeArcLineWidth )
	// Range Arc Text
	textColorJ = "green";
	textFontJ = "18px Arial";
	componentRangeArcText( objClockIslamic, "مغرب‎", textColorJ, textFontJ, degreesMaghribBegin, degreesMaghribEnd );
	componentRangeArcText( objClockIslamic, "عشاء‎", textColorJ, textFontJ, degreesIshaBegin, degreesIshaEnd1 );
	componentRangeArcText( objClockIslamic, "فجر‎", textColorJ, textFontJ, degreesFajrBegin, degreesFajrEnd );
	componentRangeArcText( objClockIslamic, "ظهر‎", textColorJ, textFontJ, degreesDhuhrBegin, degreesDhuhrEnd );
	componentRangeArcText( objClockIslamic, "عصر‎", textColorJ, textFontJ, degreesAsrBegin, degreesAsrEnd );
	// Hour Hand
	clockIslamicHandColor = "black";	// May want to change opacity to see names through hands.
	componentHand(objClockIslamic, hourDegreesJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockIslamicHandColor );
	// Minute Hand
	componentHand(objClockIslamic, minuteDegreesJ, clockMinuteHalfWidth, clockHandPointOfMaxWidth, clockMinuteLength, clockIslamicHandColor );
	// Second Hand
	componentHand(objClockIslamic, secondDegreesJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, clockIslamicHandColor );
	// Display Current or Next Prayer Time
	componentCornerText(objClockIslamic, currOrNextTime, "BL", "10px Arial", clockWidthCenter, clockHeightCenter, currOrNextColor)
	// Display Current or Next Prayer Name
	componentCornerText(objClockIslamic, currOrNextName, "BR", "15px Arial", clockWidthCenter, clockHeightCenter, currOrNextColor)
	// Back to top-left corner
	objClockIslamic.translate( -clockWidthCenter, -clockHeightCenter );

}

function decimalToDegrees( decimalJ ) {
	// Currently used for Islamic clock. Decimal is >= 0 and < 24 (0-23.99999).
	resultJ = ( decimalJ * 360 / 24 ) % 360;
	return resultJ;
}

function decimalToTime( decimalJ ) {
	// Currently used for Islamic clock. Decimal is >= 0 and < 24 (0-23.99999).
	trueDecimalJ = decimalJ % 360;
	hourDecimalJ = trueDecimalJ / 15;
	hourJ = Math.floor( hourDecimalJ );
	minuteDecimalJ = ( hourDecimalJ - hourJ ) * 100 * 0.6;
	minuteJ = Math.round( minuteDecimalJ );
	resultJ = hourJ + ":"				// 24-hour clock
	if ( minuteJ < 10 ) {
		resultJ = resultJ + "0";
	}
	resultJ = resultJ + minuteJ;
	return resultJ;
}

function calculateMetricClock( canvasID ) {
	d = new Date();
	NowJ = ((d.getMilliseconds()) + (d.getSeconds() * 1000) + (d.getMinutes() * 60 * 1000) + (d.getHours() * 60 * 60 * 1000)) / 86400000;
	
	hours = Math.floor(NowJ*10);
	minutes = Math.floor(NowJ*1000)-(hours*100);
	seconds = Math.floor(NowJ*100000)-((hours*10000)+(minutes*100));

	DisplayMinutes = minutes < 10 ? "0" + minutes : minutes;
	DisplaySeconds = seconds < 10 ? "0" + seconds : seconds;
	DisplayValueJ = hours + ":" + DisplayMinutes + ":" + DisplaySeconds;
	
	hours = hours + (minutes/100) + (seconds/10000);
	minutes = minutes + (seconds/100);
	
	seconds = seconds*3.6; // calculating seconds
	minutes = minutes*3.6; // calculating minutes
	hours = hours*36; // calculating hours
	
	drawMetricClock( canvasID, hours, minutes, seconds, DisplayValueJ );
}

function drawMetricClock( canvasID, hourDegreesJ, minuteDegreesJ, secondDegreesJ, DisplayValueJ ) {

	objClockMetric = document.getElementById(canvasID).getContext('2d');

	// Move from top-left corner to center
	objClockMetric.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClockMetric, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClockMetric, clockHeightCenter-1, clockDialLineWidth);
	// Center Disk
	componentDisk(objClockMetric, clockDiskRadius, clockDiskColor);
	// Numbers
	arrayNumbers = new Array();
	for (i=0; i<10; i++) {
		arrayNumbers[i] = i+1;
	}
	componentNumbers(objClockMetric, arrayNumbers, clockNumberLineWidth, clockNumberFont, clockNumberPixelOffset, "black", "", clockNumberScale);
	// Hour Hand
	componentHand(objClockMetric, hourDegreesJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockHandColor );
	// Minute Hand
	componentHand(objClockMetric, minuteDegreesJ, clockMinuteHalfWidth, clockHandPointOfMaxWidth, clockMinuteLength, clockHandColor );
	// Second Hand
	componentHand(objClockMetric, secondDegreesJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, clockHandColor );
	// Display Value
	componentCornerText(objClockMetric, DisplayValueJ, "BL", clockCornerTextFont, clockWidthCenter, clockHeightCenter)
	// Back to top-left corner
	objClockMetric.translate( -clockWidthCenter, -clockHeightCenter );

}

function calculateHexadecimalClock( canvasID ) {
	d = new Date();
	NowJ = Math.floor((((d.getMilliseconds()) + (d.getSeconds() * 1000) + (d.getMinutes() * 60 * 1000) + (d.getHours() * 60 * 60 * 1000)) / 86400000) * 65536);
	// Number of milliseconds in a day:  86,400,000
	// Number of hex seconds in a day:  65,536

	HexHour = Math.floor(NowJ / 4096);
	HexHourRemainder = HexHour == 0 ? NowJ : NowJ % (HexHour * 4096);
	HexMaxime = Math.floor(HexHourRemainder / 256);
	HexMaximeRemainder = HexMaxime == 0 ? HexHourRemainder : HexHourRemainder % (HexMaxime * 256);
	HexMinute = Math.floor(HexMaximeRemainder / 16);
	HexSecond = HexMinute == 0 ? HexMaximeRemainder : HexMaximeRemainder % (HexMinute * 16);
	HexShowMinute = (HexMaxime * 16) + HexMinute;

	hours = HexHour;
	minutes = HexShowMinute;
	seconds = HexSecond;

	DisplayMinutes = minutes < 16 ? "0" + minutes.toString(16).toUpperCase() : minutes.toString(16).toUpperCase();
	DisplayValueJ = hours.toString(16).toUpperCase() + "_" + DisplayMinutes + "_" + seconds.toString(16).toUpperCase();

	hours = hours + (minutes/256) + (seconds/4096);
	minutes = minutes + (seconds/16);

	seconds = seconds * (360 / 16); // calculating seconds
	minutes = minutes * (360 / 256); // calculating minutes
	hours = hours * (360 / 16); // calculating hours

	drawHexadecimalClock( canvasID, hours, minutes, seconds, DisplayValueJ );
}

function drawHexadecimalClock( canvasID, hourDegreesJ, minuteDegreesJ, secondDegreesJ, DisplayValueJ ) {

	objClockHexadecimal = document.getElementById(canvasID).getContext('2d');

	// Move from top-left corner to center
	objClockHexadecimal.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClockHexadecimal, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClockHexadecimal, clockHeightCenter-1, clockDialLineWidth);
	// Center Disk
	componentDisk(objClockHexadecimal, clockDiskRadius, clockDiskColor);
	// Numbers
	arrayNumbers = new Array();
	for (i=0; i<16; i++) {
		arrayNumbers[i] = (i+1).toString(16).toUpperCase();
	}
	componentNumbers(objClockHexadecimal, arrayNumbers, clockNumberLineWidth, clockNumberFont, clockNumberPixelOffset, "black", "", clockNumberScale);
	// Hour Hand
	componentHand(objClockHexadecimal, hourDegreesJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockHandColor );
	// Minute Hand
	componentHand(objClockHexadecimal, minuteDegreesJ, clockMinuteHalfWidth, clockHandPointOfMaxWidth, clockMinuteLength, clockHandColor );
	// Second Hand
	componentHand(objClockHexadecimal, secondDegreesJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, clockHandColor );
	// Display Value
	componentCornerText(objClockHexadecimal, DisplayValueJ, "BL", clockCornerTextFont, clockWidthCenter, clockHeightCenter);
	AltDisplayValueJ = "." + DisplayValueJ.replace( /_/g, "" );
	componentCornerText(objClockHexadecimal, AltDisplayValueJ, "BR", clockCornerTextFont, clockWidthCenter, clockHeightCenter);
	// Back to top-left corner
	objClockHexadecimal.translate( -clockWidthCenter, -clockHeightCenter );

}

function calculateChineseClock( canvasID ) {
	time=new Date(); // time object
	seconds = time.getSeconds();
	minutes = time.getMinutes();
	hours = time.getHours();
	hourNum = time.getHours();
	
	hours = hours + (minutes/60) + (seconds/3600);
	
	hourDegreesJ = hours*15; // calculating hours
	
	nowJ = ((time.getMilliseconds()) + (time.getSeconds() * 1000) + (time.getMinutes() * 60 * 1000) + (time.getHours() * 60 * 60 * 1000)) / 86400000;
	keSetupJ = (nowJ * 100 ) + 1;
	keJ = Math.floor( keSetupJ );
	fenJ = Math.floor(( keSetupJ - keJ ) * 60 );
	
	doubleHourChinese = [ "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥" ];
	doubleHourEnglish = [ "zǐ", "chǒu", "yín", "mǎo", "chén", "sì", "wǔ", "wèi", "shēn", "yǒu", "xū", "hài" ];
	
	englishTextJ = keJ + " kè " + fenJ + " fēn";
	chineseText1J = chineseNumber( keJ.toString(), false ) + "刻";
	chineseText2J = chineseNumber( fenJ.toString(), false ) + "分";
	
	fenDegreeJ = fenJ * 6;
	
	// The first doubleHour is 11:00 PM-1:00 AM. The following formula will associate the hour with the appropriate point on the arrays above.
	doubleHour = Math.floor( ( ( ( hourNum + 1 ) % 24 ) / 2 ) + 0.25 );
	doubleHourChineseText = doubleHourChinese[doubleHour] + "時";
	doubleHourEnglishText = doubleHourEnglish[doubleHour] + " watch";

	drawChineseClock( canvasID, hourDegreesJ, fenDegreeJ, chineseText1J, chineseText2J, englishTextJ, doubleHourChineseText, doubleHourEnglishText, keJ );
}

function drawChineseClock( canvasID, hourDegreesJ, fenDegreeJ, chineseText1J, chineseText2J, englishTextJ, doubleHourChineseText, doubleHourEnglishText, keJ ) {

	objClockChinese = document.getElementById(canvasID).getContext('2d');

	// Move from top-left corner to center
	objClockChinese.translate( clockWidthCenter, clockHeightCenter );
	//Background
	componentBackground(objClockChinese, 0, 0, clockHeightCenter, clockWidth, clockHeight);
	// Circular Frame
	componentOuterCircle(objClockChinese, clockHeightCenter-1, clockDialLineWidth);
	// Numbers
	arrayNumbers = new Array( "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子" );
	componentNumbers(objClockChinese, arrayNumbers, clockNumberLineWidth, "20px Times New Roman", clockNumberPixelOffset, "black", "", clockNumberScale);
	// Ke
	componentRangeArc( objClockChinese, "crimson", 0, keJ * 3.6, clockHeightCenter-1, 7 );
	// Tick Marks
	tickMarks( objClockChinese, 12, 15, clockTickMarksInnerLimit, clockTickMarksOuterLimit, "black", 1 );
	tickMarks( objClockChinese, 100, 0, clockTickMarksOuterLimit, clockHeightCenter-1, "black", 1 );
	componentOuterCircle(objClockChinese, clockTickMarksOuterLimit, clockDialLineWidth);
	// Second Hand
	componentHand(objClockChinese, fenDegreeJ, clockSecondHalfWidth, clockHandPointOfMaxWidth, clockSecondLength, "crimson" );
	// Hour Hand
	componentHand(objClockChinese, hourDegreesJ, clockHourHalfWidth, clockHandPointOfMaxWidth, clockHourLength, clockHandColor );
	// Center Disk
	componentDisk(objClockChinese, clockDiskRadius, clockDiskColor);
	// Display Time
	componentCornerText(objClockChinese, doubleHourChineseText, "TL", "9px Arial", clockWidthCenter, clockHeightCenter, "black", 3 )
	componentCornerText(objClockChinese, doubleHourEnglishText, "TR", "9px Arial", clockWidthCenter, clockHeightCenter, "black", 3 )
	componentCornerText(objClockChinese, chineseText1J, "BL", "9px Arial", clockWidthCenter, clockHeightCenter, "firebrick", -10 )
	componentCornerText(objClockChinese, chineseText2J, "BL", "9px Arial", clockWidthCenter, clockHeightCenter, "firebrick" )
	componentCornerText(objClockChinese, englishTextJ, "BR", "9px Arial", clockWidthCenter, clockHeightCenter, "firebrick")
	// Back to top-left corner
	objClockChinese.translate( -clockWidthCenter, -clockHeightCenter );

}

function chineseNumber( numberJ, traditionalJ ) {
	
	stringJ = numberJ + "";

	arrayUnitsJ = new Array( "", "一", "二", "三", "四", "五", "六", "七", "八", "九" );
	zeroJ = "零";
	tenJ = "十";
	hundredJ = "百";
	thousandJ = "千";
	decimalPointSimplifiedJ = "点";
	decimalPointTraditional = "點";

	arrayLargeNumberNameJ = new Array( "", "wàn", "yì", "zhào", "jīng", "gāi", "zǐ", "ráng", "gōu", "jiàn", "zhēng", "zài" );
	arrayLargeNumberSymbolSimplifiedJ = new Array( "", "万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载" );
	arrayLargeNumberSymbolTraditionalJ = new Array( "", "萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載" );
	
	// Confirm numberJ is a number, and process if so.
	numTestJ = stringJ.replace( /[\d\.]/g, "" );
	integerPortionJ = stringJ.replace( /\..*$/, "" );
	decimalPortonJ = stringJ.replace( /^\d*\.?/, "" );
	if ( integerPortionJ != "0" ) {
		integerPortionJ = integerPortionJ.replace( /^0+/g, "" );
	}
	if ( numTestJ != "" ) {
		
		resultJ = "NaN";
		
	} else if ( integerPortionJ.length >= 49 ) {
		
		resultJ = "Too Large"
		
	} else {
		
		if ( integerPortionJ == "0" ) {
			
			resultJ = zeroJ;
			
		} else {
			
			thisNumJ = new Array();
			while ( integerPortionJ != "" ) {
				thisMyriadJ = integerPortionJ.slice( -4 );
				thisNumJ.push( thisMyriadJ );
				thisMyriadJ = "";
				integerPortionJ = integerPortionJ.replace( /\d{1,4}$/, "");
			}
			resultJ = "";
			for (i=0; i<thisNumJ.length; i++) {
				thisBlockJ = "";
				thisUnitsJ = thisNumJ[i].slice(-1);
				thisTensJ = thisNumJ[i].slice(-2, -1);
				thisHundredsJ = thisNumJ[i].slice(-3, -2);
				thisThousandsJ = thisNumJ[i].slice(-4, -3);
				if ( thisUnitsJ != "" && thisUnitsJ != "0" ) {
					thisBlockJ = arrayUnitsJ[parseInt(thisUnitsJ)] + thisBlockJ;
				}
				if ( thisTensJ != "" && thisTensJ != "0" ) {
					thisBlockJ = arrayUnitsJ[parseInt(thisTensJ)] + tenJ + thisBlockJ;
				}
				if ( thisHundredsJ != "" && thisHundredsJ != "0" ) {
					thisBlockJ = arrayUnitsJ[parseInt(thisHundredsJ)] + hundredJ + thisBlockJ;
				}
				if ( thisThousandsJ != "" && thisThousandsJ != "0" ) {
					thisBlockJ = arrayUnitsJ[parseInt(thisThousandsJ)] + thousandJ + thisBlockJ;
				}
				thisBlockJ = thisBlockJ + arrayLargeNumberSymbolSimplifiedJ[i];
				resultJ = thisBlockJ + resultJ;
			}
			if ( resultJ.length <= 3 && resultJ.slice(0, 2) == "一十" ) {
				resultJ = resultJ.slice( 1, resultJ.length );
			}
			if ( decimalPortonJ != "" ) {
				decimalPortonJ = decimalPortonJ.replace( /0/g, zeroJ );
				decimalPortonJ = decimalPortonJ.replace( /1/g, arrayUnitsJ[1] );
				decimalPortonJ = decimalPortonJ.replace( /2/g, arrayUnitsJ[2] );
				decimalPortonJ = decimalPortonJ.replace( /3/g, arrayUnitsJ[3] );
				decimalPortonJ = decimalPortonJ.replace( /4/g, arrayUnitsJ[4] );
				decimalPortonJ = decimalPortonJ.replace( /5/g, arrayUnitsJ[5] );
				decimalPortonJ = decimalPortonJ.replace( /6/g, arrayUnitsJ[6] );
				decimalPortonJ = decimalPortonJ.replace( /7/g, arrayUnitsJ[7] );
				decimalPortonJ = decimalPortonJ.replace( /8/g, arrayUnitsJ[8] );
				decimalPortonJ = decimalPortonJ.replace( /9/g, arrayUnitsJ[9] );
				resultJ = resultJ + decimalPointSimplifiedJ + decimalPortonJ;
			}
		}
		
	}
	
	if ( traditionalJ == true ) {
		resultJ = resultJ.replace( decimalPointSimplifiedJ, decimalPointTraditional );
		for ( i=1; i<=11; i++ ) {
			resultJ = resultJ.replace( arrayLargeNumberSymbolSimplifiedJ[i], arrayLargeNumberSymbolTraditionalJ[i] );
		}
	}
	
	return resultJ;

}
