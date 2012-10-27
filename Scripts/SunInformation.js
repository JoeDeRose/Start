/*
	Calculation of local times of sunrise, solar noon, and sunset
	based on the calculation procedure by NOAA in the javascript in
	http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html and
	http://www.srrb.noaa.gov/highlights/sunrise/azel.html
	
	Five functions are available for use from Excel worksheets:
	
		- sunrise(lat, lon, year, month, day, timezone, dlstime)
		- solarnoon(lat, lon, year, month, day, timezone, dlstime)
		- sunset(lat, lon, year, month, day, timezone, dlstime)
		- solarazimuth(lat, lon, year, month, day, hour, minute, second, timezone, dlstime)
		- solarelevation(lat, lon, year, month, day, hour, minute, second, timezone, dlstime)
	
	The sign convention for inputs to the functions named sunrise, solarnoon,
	sunset, solarazimuth, and solarelevationis:
	
		- positive latitude decimal degrees for northern hemisphere
		- negative longitude degrees for western hemisphere
		- negative time zone hours for western hemisphere
	
	The other functions in the VBA module use the original
	NOAA sign convention of positive longitude in the western hemisphere.
	
	The calculations in the NOAA Sunrise/Sunset and Solar Position
	Calculators are based on equations from Astronomical Algorithms,
	by Jean Meeus. NOAA also included atmospheric refraction effects.
	The sunrise and sunset results were reported by NOAA
	to be accurate to within +/- 1 minute for locations between +/- 72°
	latitude, and within ten minutes outside of those latitudes.
	
	This translation was tested for selected locations
	and found to provide results within +/- 1 minute of the
	original Javascript code.
	
	This translation does not include calculation of prior or next
	susets for locations above the Arctic Circle and below the
	Antarctic Circle, when a sunrise or sunset does not occur.
	
	Translated from NOAA's Javascript to Excel VBA by:
	
	Greg Pelletier
	Olympia, WA
	e-mail: pelican@vei.net
*/

function radToDeg(angleRad)
	{
		var radToDeg;
		
		// Convert radian angle to degrees
        radToDeg = (180 * angleRad / Math.PI);
		return radToDeg;
	}

function degToRad(angleDeg)
	{
		var degToRad;
		
		// Convert degree angle to radians
        degToRad = (Math.PI * angleDeg / 180);
		return degToRad;
	}

function calcJD(year, month, day)
	{
		/*
			***********************************************************************
			* Name:    calcJD
			* Type:    Function
			* Purpose: Julian day from calendar day
			* Arguments:
			*   year : 4 digit year
			*   month: January = 1
			*   day  : 1 - 31
			* Return value:
			*   The Julian day corresponding to the date
			* Note:
			*   Number is returned for start of day.  Fractional days should be
			*   added later.
			***********************************************************************
		*/

		var calcJD;
		
		if (month <= 2)
			{
				year = year - 1;
				month = month + 12;
			}

		A = Math.floor(year / 100);
		B = 2 - A + Math.floor(A / 4);

		JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
		calcJD = JD;

		// gp put the year and month back where they belong
		if (month == 13)
			{
				month = 1;
				year = year + 1;
			}
		if (month == 14)
			{
				month = 2;
				year = year + 1;
			}
		
		return calcJD;
	}

function calcTimeJulianCent(JD)
	{
		/*
			***********************************************************************
			* Name:    calcTimeJulianCent
			* Type:    Function
			* Purpose: convert Julian Day to centuries since J2000.0.
			* Arguments:
			*   jd : the Julian Day to convert
			* Return value:
			*   the T value corresponding to the Julian Day
			***********************************************************************
		*/

		var calcTimeJulianCent;
		
		var t;

        t = (JD - 2451545) / 36525;
        calcTimeJulianCent = t;
		
		return calcTimeJulianCent;
	}

function calcJDFromJulianCent(t)
	{
		/*
			***********************************************************************
			* Name:    calcJDFromJulianCent
			* Type:    Function
			* Purpose: convert centuries since J2000.0 to Julian Day.
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   the Julian Day corresponding to the t value
			***********************************************************************
		*/
		
		var calcJDFromJulianCent;
		
		var JD;

        JD = t * 36525 + 2451545;
        calcJDFromJulianCent = JD;
		
		return calcJDFromJulianCent;
	}

function calcGeomMeanLongSun(t)
	{
		/*
			***********************************************************************
			* Name:    calGeomMeanLongSun
			* Type:    Function
			* Purpose: calculate the Geometric Mean Longitude of the Sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   the Geometric Mean Longitude of the Sun in degrees
			***********************************************************************
		*/
		
		var calcGeomMeanLongSun;
		
		var l0;

        l0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
		while ((l0 > 360) || (l0 < 0))
			{
				if (l0 > 360)
					{
						l0 = l0 - 360;
					}
				if (l0 < 0)
					{
						l0 = l0 + 360;
					}
			}
        
        calcGeomMeanLongSun = l0;

		return calcGeomMeanLongSun;
	}

function calcGeomMeanAnomalySun(t)
	{
		/*
			***********************************************************************
			* Name:    calGeomAnomalySun
			* Type:    Function
			* Purpose: calculate the Geometric Mean Anomaly of the Sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   the Geometric Mean Anomaly of the Sun in degrees
			***********************************************************************
    	*/

		var calcGeomMeanAnomalySun;
		
        m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
        calcGeomMeanAnomalySun = m;
        
		return calcGeomMeanAnomalySun;
	}

function calcEccentricityEarthOrbit(t)
	{
		/*
			***********************************************************************
			* Name:    calcEccentricityEarthOrbit
			* Type:    Function
			* Purpose: calculate the eccentricity of earth's orbit
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   the unitless eccentricity
			***********************************************************************
		*/

		var calcEccentricityEarthOrbit;
		
        e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
        calcEccentricityEarthOrbit = e;

		return calcEccentricityEarthOrbit;
	}

function calcSunEqOfCenter(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunEqOfCenter
			* Type:    Function
			* Purpose: calculate the equation of center for the sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   in degrees
			***********************************************************************
		*/

		var calcSunEqOfCenter;
		
        m = calcGeomMeanAnomalySun(t);

        mrad = degToRad(m);
        sinm = Math.sin(mrad);
        sin2m = Math.sin(mrad + mrad);
        sin3m = Math.sin(mrad + mrad + mrad);

        c = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
        
        calcSunEqOfCenter = c;
		
		return calcSunEqOfCenter;
	}

function calcSunTrueLong(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunTrueLong
			* Type:    Function
			* Purpose: calculate the true longitude of the sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   sun's true longitude in degrees
			***********************************************************************
		*/

		var calcSunTrueLong;
		
        l0 = calcGeomMeanLongSun(t);
        c = calcSunEqOfCenter(t);

        O = l0 + c;
        calcSunTrueLong = O;
		
		return calcSunTrueLong;
	}

function calcSunTrueAnomaly(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunTrueAnomaly (not used by sunrise, solarnoon, sunset)
			* Type:    Function
			* Purpose: calculate the true anamoly of the sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   sun's true anamoly in degrees
			***********************************************************************
		*/

		var calcSunTrueAnomaly;
		
        m = calcGeomMeanAnomalySun(t);
        c = calcSunEqOfCenter(t);

        v = m + c;
        calcSunTrueAnomaly = v;
		
		return calcSunTrueAnomaly;
	}

function calcSunRadVector(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunRadVector (not used by sunrise, solarnoon, sunset)
			* Type:    Function
			* Purpose: calculate the distance to the sun in AU
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   sun radius vector in AUs
			***********************************************************************
		*/

		var calcSunRadVector;
		
        v = calcSunTrueAnomaly(t);
        e = calcEccentricityEarthOrbit(t);
 
        R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
        calcSunRadVector = R;
		
		return calcSunRadVector;
	}

function calcSunApparentLong(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunApparentLong (not used by sunrise, solarnoon, sunset)
			* Type:    Function
			* Purpose: calculate the apparent longitude of the sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   sun's apparent longitude in degrees
			***********************************************************************
		*/

		var calcSunApparentLong;
		
        O = calcSunTrueLong(t);

        omega = 125.04 - 1934.136 * t;
        lambda = O - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
        calcSunApparentLong = lambda;
		
		return calcSunApparentLong;
	}

function calcMeanObliquityOfEcliptic(t)
	{
		/*
			***********************************************************************
			* Name:    calcMeanObliquityOfEcliptic
			* Type:    Function
			* Purpose: calculate the mean obliquity of the ecliptic
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   mean obliquity in degrees
			***********************************************************************
		*/

		var calcMeanObliquityOfEcliptic;
		
        seconds = 21.448 - t * (46.815 + t * (0.00059 - t * (0.001813)));
        e0 = 23 + (26 + (seconds / 60)) / 60;
        calcMeanObliquityOfEcliptic = e0;
		
		return calcMeanObliquityOfEcliptic;
	}

function calcObliquityCorrection(t)
	{
		/*
			***********************************************************************
			* Name:    calcObliquityCorrection
			* Type:    Function
			* Purpose: calculate the corrected obliquity of the ecliptic
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   corrected obliquity in degrees
			***********************************************************************
		*/

		var calcObliquityCorrection;
		
        e0 = calcMeanObliquityOfEcliptic(t);

        omega = 125.04 - 1934.136 * t;
        e = e0 + 0.00256 * Math.cos(degToRad(omega));
        calcObliquityCorrection = e;
		
		return calcObliquityCorrection;
	}

function calcSunRtAscension(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunRtAscension (not used by sunrise, solarnoon, sunset)
			* Type:    Function
			* Purpose: calculate the right ascension of the sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   sun's right ascension in degrees
			***********************************************************************
		*/

		var calcSunRtAscension;
		
        e = calcObliquityCorrection(t);
        lambda = calcSunApparentLong(t);
 
        tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
        tanadenom = (Math.cos(degToRad(lambda)));

// original NOAA code using javascript Math.atan2(y,x) convention:
		alpha = radToDeg(Math.atan2(tananum, tanadenom));

// translated using Excel VBA Atan2(x,y) convention:
//		alpha = radToDeg(Atan2(tanadenom, tananum))
        
        calcSunRtAscension = alpha;
		
		return calcSunRtAscension;
	}

function calcSunDeclination(t)
	{
		/*
			***********************************************************************
			* Name:    calcSunDeclination
			* Type:    Function
			* Purpose: calculate the declination of the sun
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   sun's declination in degrees
			***********************************************************************
		*/

		var calcSunDeclination;
		
        e = calcObliquityCorrection(t);
        lambda = calcSunApparentLong(t);

        sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
        theta = radToDeg(Math.asin(sint));
        calcSunDeclination = theta;
		
		return calcSunDeclination;
	}

function calcEquationOfTime(t)
	{
		/*
			***********************************************************************
			* Name:    calcEquationOfTime
			* Type:    Function
			* Purpose: calculate the difference between true solar time and mean
			*     solar time
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			* Return value:
			*   equation of time in minutes of time
			***********************************************************************
		*/

		var calcEquationOfTime;
		
        epsilon = calcObliquityCorrection(t);
        l0 = calcGeomMeanLongSun(t);
        e = calcEccentricityEarthOrbit(t);
        m = calcGeomMeanAnomalySun(t);

        y = Math.tan(degToRad(epsilon) / 2);
        y = Math.pow(y, 2);

        sin2l0 = Math.sin(2 * degToRad(l0));
        sinm = Math.sin(degToRad(m));
        cos2l0 = Math.cos(2 * degToRad(l0));
        sin4l0 = Math.sin(4 * degToRad(l0));
        sin2m = Math.sin(2 * degToRad(m));

        Etime = y * sin2l0 - 2 * e * sinm + 4 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;

        calcEquationOfTime = radToDeg(Etime) * 4;
		
		return calcEquationOfTime;
	}
    
   
function calcHourAngleSunrise(lat, solarDec)
	{
		/*
			***********************************************************************
			* Name:    calcHourAngleSunrise
			* Type:    Function
			* Purpose: calculate the hour angle of the sun at sunrise for the
			*         latitude
			* Arguments:
			*   lat : latitude of observer in degrees
			* solarDec : declination angle of sun in degrees
			* Return value:
			*   hour angle of sunrise in radians
			***********************************************************************
		*/

		var calcHourAngleSunrise;
		
        latRad = degToRad(lat);
        sdRad = degToRad(solarDec);

        HAarg = (Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

        HA = (Math.acos(Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));

        calcHourAngleSunrise = HA;
		
		return calcHourAngleSunrise;
	}


function calcHourAngleSunset(lat, solarDec)
	{
		/*
			***********************************************************************
			* Name:    calcHourAngleSunset
			* Type:    Function
			* Purpose: calculate the hour angle of the sun at sunset for the
			*         latitude
			* Arguments:
			*   lat : latitude of observer in degrees
			* solarDec : declination angle of sun in degrees
			* Return value:
			*   hour angle of sunset in radians
			***********************************************************************
		*/
		
		var calcHourAngleSunset;
		
        latRad = degToRad(lat);
        sdRad = degToRad(solarDec);

        HAarg = (Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

        HA = (Math.acos(Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));

        calcHourAngleSunset = -HA;
		
		return calcHourAngleSunset;
	}

function calcSunriseUTC(JD, latitude, longitude)
	{
		/*
			***********************************************************************
			* Name:    calcSunriseUTC
			* Type:    Function
			* Purpose: calculate the Universal Coordinated Time (UTC) of sunrise
			*         for the given day at the given location on earth
			* Arguments:
			*   JD  : julian day
			*   latitude : latitude of observer in degrees
			*   longitude : longitude of observer in degrees
			* Return value:
			*   time in minutes from zero Z
			***********************************************************************
		*/

		var calcSunriseUTC;
		
        t = calcTimeJulianCent(JD);

// *** First pass to approximate sunrise

        eqtime = calcEquationOfTime(t);
        solarDec = calcSunDeclination(t);
        hourangle = calcHourAngleSunrise(latitude, solarDec);

        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
// in minutes of time
        timeUTC = 720 + timeDiff - eqtime;
// in minutes

// *** Second pass includes fractional jday in gamma calc

        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440);
        eqtime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourangle = calcHourAngleSunrise(latitude, solarDec);
        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;
// in minutes

        calcSunriseUTC = timeUTC;
		
		return calcSunriseUTC;
	}

function calcSolNoonUTC(t, longitude)
	{
		/*
			***********************************************************************
			* Name:    calcSolNoonUTC
			* Type:    Function
			* Purpose: calculate the Universal Coordinated Time (UTC) of solar
			*     noon for the given day at the given location on earth
			* Arguments:
			*   t : number of Julian centuries since J2000.0
			*   longitude : longitude of observer in degrees
			* Return value:
			*   time in minutes from zero Z
			***********************************************************************
		*/

		var calcSolNoonUTC;
		
        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + 0.5 + longitude / 360);

        eqtime = calcEquationOfTime(newt);
        solarNoonDec = calcSunDeclination(newt);
        solNoonUTC = 720 + (longitude * 4) - eqtime;
        
        calcSolNoonUTC = solNoonUTC;
		
		return calcSolNoonUTC;
	}

function calcSunsetUTC(JD, latitude, longitude)
	{
		/*
			***********************************************************************
			* Name:    calcSunsetUTC
			* Type:    Function
			* Purpose: calculate the Universal Coordinated Time (UTC) of sunset
			*         for the given day at the given location on earth
			* Arguments:
			*   JD  : julian day
			*   latitude : latitude of observer in degrees
			*   longitude : longitude of observer in degrees
			* Return value:
			*   time in minutes from zero Z
			***********************************************************************
		*/

		var calcSunsetUTC;
		
        t = calcTimeJulianCent(JD);

// First calculates sunrise and approx length of day

        eqtime = calcEquationOfTime(t);
        solarDec = calcSunDeclination(t);
        hourangle = calcHourAngleSunset(latitude, solarDec);

        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;

// first pass used to include fractional day in gamma calc

        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440);
        eqtime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourangle = calcHourAngleSunset(latitude, solarDec);

        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;
// in minutes

        calcSunsetUTC = timeUTC;
		
		return calcSunsetUTC;
	}

function sunrise(lat, lon, year, month, day, timezone, dlstime)
    {
		/*
			***********************************************************************
			* Name:    sunrise
			* Type:    Main Function called by spreadsheet
			* Purpose: calculate time of sunrise  for the entered date
			*     and location.
			* For latitudes greater than 72 degrees N and S, calculations are
			* accurate to within 10 minutes. For latitudes less than +/- 72°
			* accuracy is approximately one minute.
			* Arguments:
			*   latitude = latitude (decimal degrees)
			*   longitude = longitude (decimal degrees)
			*    NOTE: longitude is negative for western hemisphere for input cells
			*          in the spreadsheet for calls to the functions named
			*          sunrise, solarnoon, and sunset. Those functions convert the
			*          longitude to positive for the western hemisphere for calls to
			*          other functions using the original sign convention
			*          from the NOAA javascript code.
			*   year = year
			*   month = month
			*   day = day
			*   timezone = time zone hours relative to GMT/UTC (hours)
			*   dlstime = daylight savings time (0 = no, 1 = yes) (hours)
			* Return value:
			*   sunrise time in local time (days)
			***********************************************************************
		*/

			var sunrise;
			
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8
				}
            if (latitude < -89.8)
				{
					latitude = -89.8
				}
            
            JD = calcJD(year, month, day);

// Calculate sunrise for this date
            riseTimeGMT = calcSunriseUTC(JD, latitude, longitude);
             
// adjust for time zone and daylight savings time in minutes
            riseTimeLST = riseTimeGMT + (60 * timezone) + (dlstime * 60);

// convert to days
            sunrise = riseTimeLST / 1440;

			return sunrise;
	}

function solarnoon(lat, lon, year, month, day, timezone, dlstime)
	{
		/*
			***********************************************************************
			* Name:    solarnoon
			* Type:    Main Function called by spreadsheet
			* Purpose: calculate the Universal Coordinated Time (UTC) of solar
			*     noon for the given day at the given location on earth
			* Arguments:
			*    year
			*    month
			*    day
			*   longitude : longitude of observer in degrees
			*    NOTE: longitude is negative for western hemisphere for input cells
			*          in the spreadsheet for calls to the functions named
			*          sunrise, solarnoon, and sunset. Those functions convert the
			*          longitude to positive for the western hemisphere for calls to
			*          other functions using the original sign convention
			*          from the NOAA javascript code.
			* Return value:
			*   time of solar noon in local time days
			***********************************************************************
		*/

		var solarnoon;
		
// change sign convention for longitude from negative to positive in western hemisphere
        longitude = lon * -1;
        latitude = lat;
        if (latitude > 89.8)
			{
				latitude = 89.8
			}
        if (latitude < -89.8)
			{
				latitude = -89.8
			}
        
        JD = calcJD(year, month, day);
        t = calcTimeJulianCent(JD);
        
        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + 0.5 + longitude / 360);

        eqtime = calcEquationOfTime(newt);
        solarNoonDec = calcSunDeclination(newt);
        solNoonUTC = 720 + (longitude * 4) - eqtime;
        
// adjust for time zone and daylight savings time in minutes
        solarnoon = solNoonUTC + (60 * timezone) + (dlstime * 60);

// convert to days
        solarnoon = solarnoon / 1440;
		
		return solarnoon;
	}

function sunset(lat, lon, year, month, day, timezone, dlstime)
    {
		/*
			***********************************************************************
			* Name:    sunset
			* Type:    Main Function called by spreadsheet
			* Purpose: calculate time of sunrise and sunset for the entered date
			*     and location.
			* For latitudes greater than 72 degrees N and S, calculations are
			* accurate to within 10 minutes. For latitudes less than +/- 72°
			* accuracy is approximately one minute.
			* Arguments:
			*   latitude = latitude (decimal degrees)
			*   longitude = longitude (decimal degrees)
			*    NOTE: longitude is negative for western hemisphere for input cells
			*          in the spreadsheet for calls to the functions named
			*          sunrise, solarnoon, and sunset. Those functions convert the
			*          longitude to positive for the western hemisphere for calls to
			*          other functions using the original sign convention
			*          from the NOAA javascript code.
			*   year = year
			*   month = month
			*   day = day
			*   timezone = time zone hours relative to GMT/UTC (hours)
			*   dlstime = daylight savings time (0 = no, 1 = yes) (hours)
			* Return value:
			*   sunset time in local time (days)
			***********************************************************************
		*/

		var sunset;
		
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8
				}
            if (latitude < -89.8)
				{
					latitude = -89.8
				}
            
            JD = calcJD(year, month, day);

// Calculate sunset for this date
            setTimeGMT = calcSunsetUTC(JD, latitude, longitude);
            
// adjust for time zone and daylight savings time in minutes
            setTimeLST = setTimeGMT + (60 * timezone) + (dlstime * 60);

// convert to days
            sunset = setTimeLST / 1440;
			
			return sunset;
	}

function solarazimuth(lat, lon, year, month, day, hours, minutes, seconds, timezone, dlstime)
	{
		/*
			***********************************************************************
			* Name:    solarazimuth
			* Type:    Main Function
			* Purpose: calculate solar azimuth (deg from north) for the entered
			*          date, time and location. Returns -999999 if darker than twilight
			*
			* Arguments:
			*   latitude, longitude, year, month, day, hour, minute, second,
			*   timezone, daylightsavingstime
			* Return value:
			*   solar azimuth in degrees from north
			*
			* Note: solarelevation and solarazimuth functions are identical
			*       and could be converted to a VBA subroutine that would return
			*       both values.
			*
			***********************************************************************
		*/

		var solarazimuth;
		
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8
				}
            if (latitude < -89.8)
				{
					latitude = -89.8
				}
            
// change time zone to ppositive hours in western hemisphere
            zone = timezone * -1;
            daySavings = dlstime * 60;
            hh = hours - (daySavings / 60);
            mm = minutes;
            ss = seconds;

// timenow is GMT time for calculation in hours since 0Z
            timenow = hh + mm / 60 + ss / 3600 + zone;

            JD = calcJD(year, month, day);
            t = calcTimeJulianCent(JD + timenow / 24);
            R = calcSunRadVector(t);
            alpha = calcSunRtAscension(t);
            theta = calcSunDeclination(t);
            Etime = calcEquationOfTime(t);

            eqtime = Etime;
            solarDec = theta;
// in degrees
            earthRadVec = R;

            solarTimeFix = eqtime - 4 * longitude + 60 * zone;
            trueSolarTime = hh * 60 + mm + ss / 60 + solarTimeFix;
// in minutes

            while (trueSolarTime > 1440)
				{
	                trueSolarTime = trueSolarTime - 1440
				}
            
            hourangle = trueSolarTime / 4 - 180;
// Thanks to Louis Schwarzmayr for the next line:
            if (hourangle < -180)
				{
					hourangle = hourangle + 360
				}

            harad = degToRad(hourangle);

            csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(solarDec)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(solarDec)) * Math.cos(harad);

            if (csz > 1)
				{
					csz = 1
				}
            else if (csz < -1)
				{
	                csz = -1
				}
            
            zenith = radToDeg(Math.acos(csz));

            azDenom = (Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)));
            
            if (Math.abs(azDenom) > 0.001)
				{
					azRad = ((Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith))) - Math.sin(degToRad(solarDec))) / azDenom;
					if (Math.abs(azRad) > 1)
						{
							if (azRad < 0)
								{
									azRad = -1;
								}
							else
								{
									azRad = 1;
								}
						}
	
					azimuth = 180 - radToDeg(Math.acos(azRad));
	
					if (hourangle > 0)
						{
							azimuth = -azimuth;
						}
				}
            else
				{
					if (latitude > 0)
						{
							azimuth = 180;
						}
					else
						{
							azimuth = 0;
						}
				}
            if (azimuth < 0)
				{
	                azimuth = azimuth + 360;
				}
                        
            exoatmElevation = 90 - zenith;

/*
beginning of complex expression commented out
            if (exoatmElevation > 85)
				{
	                refractionCorrection = 0;
				}
            else
				{
					te = Math.tan(degToRad(exoatmElevation));
					if (exoatmElevation > 5)
						{
							refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
						}
					else if (exoatmElevation > -0.575)
						{
							refractionCorrection = 1735 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
						}
					else
						{
							refractionCorrection = -20.774 / te;
						}
					refractionCorrection = refractionCorrection / 3600;
				}
end of complex expression
*/

// beginning of simplified expression
            if (exoatmElevation > 85)
				{
	                refractionCorrection = 0;
				}
            else
				{
					te = Math.tan(degToRad(exoatmElevation));
					if (exoatmElevation > 5)
						{
							refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
						}
					else if (exoatmElevation > -0.575)
						{
							step1 = (-12.79 + exoatmElevation * 0.711);
							step2 = (103.4 + exoatmElevation * (step1));
							step3 = (-518.2 + exoatmElevation * (step2));
							refractionCorrection = 1735 + exoatmElevation * (step3);
						}
					else
						{
							refractionCorrection = -20.774 / te;
						}
					refractionCorrection = refractionCorrection / 3600;
				}
// end of simplified expression
            
            solarzen = zenith - refractionCorrection;
                     
// (JOE DeROSE:  This section was commented out in the original, but appears to be the only place where the value is applied to the function name
// Therefore, I have removed the comment
// /*
            if (solarzen < 108)
				{
					solarazimuth = azimuth;
					solarelevation = 90 - solarzen;
					if (solarzen < 90)
						{
							coszen = Math.cos(degToRad(solarzen));
						}
					else
						{
							coszen = 0;
						}
				}
            else    // do not report az & el after astro twilight
				{
					solarazimuth = -999999;
					solarelevation = -999999;
					coszen = -999999;
				}
// */
		return solarazimuth;
	}

function solarelevation(lat, lon, year, month, day, hours, minutes, seconds, timezone, dlstime)
	{
		/*
			***********************************************************************
			* Name:    solarazimuth
			* Type:    Main Function
			* Purpose: calculate solar azimuth (deg from north) for the entered
			*          date, time and location. Returns -999999 if darker than twilight
			*
			* Arguments:
			*   latitude, longitude, year, month, day, hour, minute, second,
			*   timezone, daylightsavingstime
			* Return value:
			*   solar azimuth in degrees from north
			*
			* Note: solarelevation and solarazimuth functions are identical
			*       and could converted to a VBA subroutine that would return
			*       both values.
			*
			***********************************************************************
		*/

		var solarelevation;
		
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8;
				}
            if (latitude < -89.8)
				{
					latitude = -89.8;
				}
            
//change time zone to ppositive hours in western hemisphere
            zone = timezone * -1;
            daySavings = dlstime * 60;
            hh = hours - (daySavings / 60);
            mm = minutes;
            ss = seconds;

////    timenow is GMT time for calculation in hours since 0Z
            timenow = hh + mm / 60 + ss / 3600 + zone;

            JD = calcJD(year, month, day);
            t = calcTimeJulianCent(JD + timenow / 24);
            R = calcSunRadVector(t);
            alpha = calcSunRtAscension(t);
            theta = calcSunDeclination(t);
            Etime = calcEquationOfTime(t);

            eqtime = Etime;
            solarDec = theta;
			// in degrees
            earthRadVec = R;

            solarTimeFix = eqtime - 4 * longitude + 60 * zone;
            trueSolarTime = hh * 60 + mm + ss / 60 + solarTimeFix;
            // in minutes

            while (trueSolarTime > 1440)
				{
	                trueSolarTime = trueSolarTime - 1440;
				}
            
            hourangle = trueSolarTime / 4 - 180;
            // Thanks to Louis Schwarzmayr for the next line:
            if (hourangle < -180)
				{
					hourangle = hourangle + 360;
				}

            harad = degToRad(hourangle);

            csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(solarDec)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(solarDec)) * Math.cos(harad);

            if (csz > 1)
				{
	                csz = 1
				}
            else if (csz < -1)
				{
	                csz = -1
				}
            
            zenith = radToDeg(Math.acos(csz));

            azDenom = (Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)));
            
            if (Math.abs(azDenom) > 0.001)
				{
					azRad = ((Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith))) - Math.sin(degToRad(solarDec))) / azDenom;
					if (Math.abs(azRad) > 1)
						{
							if (azRad < 0)
								{
									azRad = -1;
								}
							else
								{
									azRad = 1;
								}
						}
	
					azimuth = 180 - radToDeg(Math.acos(azRad));
	
					if (hourangle > 0)
						{
							azimuth = -azimuth;
						}
				}
            else
                {
					if (latitude > 0)
						{
							azimuth = 180;
						}
					else
						{
							azimuth = 0;
						}
				}
            if (azimuth < 0)
				{
	                azimuth = azimuth + 360;
				}
                        
            exoatmElevation = 90 - zenith;

/*
beginning of complex expression commented out
            if (exoatmElevation > 85)
				{
	                refractionCorrection = 0;
				}
            else
                {
					te = Math.tan(degToRad(exoatmElevation))
					if (exoatmElevation > 5)
						{
							refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
						}
					else if (exoatmElevation > -0.575)
						{
							refractionCorrection = 1735 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
						}
					else
						{
							refractionCorrection = -20.774 / te;
						}
					refractionCorrection = refractionCorrection / 3600;
				}
end of complex expression
*/

//beginning of simplified expression
            if (exoatmElevation > 85)
				{
					refractionCorrection = 0;
				}
            else
				{
					te = Math.tan(degToRad(exoatmElevation));
					if (exoatmElevation > 5)
						{
							refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
						}
					else if (exoatmElevation > -0.575)
						{
							step1 = (-12.79 + exoatmElevation * 0.711);
							step2 = (103.4 + exoatmElevation * (step1));
							step3 = (-518.2 + exoatmElevation * (step2));
							refractionCorrection = 1735 + exoatmElevation * (step3);
						}
					else
						{
							refractionCorrection = -20.774 / te;
						}
					refractionCorrection = refractionCorrection / 3600;
				}
//end of simplified expression
            
            solarzen = zenith - refractionCorrection
                     
// (JOE DeROSE:  This section was commented out in the original, but appears to be the only place where the value is applied to the function name
// Therefore, I have removed the comment
// /*
			if (solarzen < 108)
				{
					solarazimuth = azimuth;
					solarelevation = 90 - solarzen;
					if (solarzen < 90)
						{
							coszen = Math.cos(degToRad(solarzen));
						}
					else
						{
							coszen = 0;
						}
				}
			else    // do not report az & el after astro twilight
				{
					solarazimuth = -999999;
					solarelevation = -999999;
					coszen = -999999;
				}
				
// */
			
			return solarelevation;
	}

function solarposition(lat, lon, year, month, day, hours, minutes, seconds, timezone, dlstime, solarazimuth, solarelevation)
	{
		/*
			***********************************************************************
			* Name:    solarazimuth
			* Type:    Main Function
			* Purpose: calculate solar azimuth (deg from north) for the entered
			*          date, time and location. Returns -999999 if darker than twilight
			*
			* Arguments:
			*   latitude, longitude, year, month, day, hour, minute, second,
			*   timezone, daylightsavingstime
			* Return value:
			*   solar azimuth in degrees from north
			*
			* Note: solarelevation and solarazimuth functions are identical
			*       and could converted to a VBA subroutine that would return
			*       both values.
			*
			***********************************************************************
		*/

		var solarposition;
		
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8;
				}
            if (latitude < -89.8)
				{
					latitude = -89.8;
				}
            
//change time zone to ppositive hours in western hemisphere
            zone = timezone * -1;
            daySavings = dlstime * 60;
            hh = hours - (daySavings / 60);
            mm = minutes;
            ss = seconds;

////    timenow is GMT time for calculation in hours since 0Z
            timenow = hh + mm / 60 + ss / 3600 + zone;

            JD = calcJD(year, month, day);
            t = calcTimeJulianCent(JD + timenow / 24);
            R = calcSunRadVector(t);
            alpha = calcSunRtAscension(t);
            theta = calcSunDeclination(t);
            Etime = calcEquationOfTime(t);

            eqtime = Etime;
            solarDec = theta;
			// in degrees
            earthRadVec = R;

            solarTimeFix = eqtime - 4 * longitude + 60 * zone;
            trueSolarTime = hh * 60 + mm + ss / 60 + solarTimeFix;
            // in minutes

            while (trueSolarTime > 1440)
				{
	                trueSolarTime = trueSolarTime - 1440;
				}
            
            hourangle = trueSolarTime / 4 - 180;
            // Thanks to Louis Schwarzmayr for the next line:
            if (hourangle < -180)
				{
					hourangle = hourangle + 360;
				}

            harad = degToRad(hourangle);

            csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(solarDec)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(solarDec)) * Math.cos(harad);

            if (csz > 1)
				{
	                csz = 1;
				}
            else if (csz < -1)
				{
	                csz = -1;
				}
            
            zenith = radToDeg(Math.acos(csz));

            azDenom = (Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)));
            
            if (Math.abs(azDenom) > 0.001)
				{
					azRad = ((Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith))) - Math.sin(degToRad(solarDec))) / azDenom;
					if (Math.abs(azRad) > 1)
						{
							if (azRad < 0)
								{
									azRad = -1;
								}
							else
								{
									azRad = 1
								}
						}
	
					azimuth = 180 - radToDeg(Math.acos(azRad));
	
					if (hourangle > 0)
						{
							azimuth = -azimuth;
						}
				}
            else
				{
					if (latitude > 0)
						{
							azimuth = 180;
						}
					else
						{
							azimuth = 0;
						}
				}
            if (azimuth < 0)
				{
	                azimuth = azimuth + 360;
				}
                        
            exoatmElevation = 90 - zenith;

/*
beginning of complex expression commented out
            if (exoatmElevation > 85)
				{
	                refractionCorrection = 0;
				}
            else
				{
					te = Math.tan(degToRad(exoatmElevation));
					if (exoatmElevation > 5)
						{
							refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
						}
					else if (exoatmElevation > -0.575)
						{
							refractionCorrection = 1735 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
						}
					else
						{
							refractionCorrection = -20.774 / te;
						}
					refractionCorrection = refractionCorrection / 3600;
				}
end of complex expression
*/

//beginning of simplified expression
            if (exoatmElevation > 85)
				{
                	refractionCorrection = 0;
				}
            else
				{
					te = Math.tan(degToRad(exoatmElevation));
					if (exoatmElevation > 5)
						{
							refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
						}
					else if (exoatmElevation > -0.575)
						{
							step1 = (-12.79 + exoatmElevation * 0.711);
							step2 = (103.4 + exoatmElevation * (step1));
							step3 = (-518.2 + exoatmElevation * (step2));
							refractionCorrection = 1735 + exoatmElevation * (step3);
						}
					else
						{
							refractionCorrection = -20.774 / te;
						}
					refractionCorrection = refractionCorrection / 3600;
				}
//end of simplified expression
            
            
            solarzen = zenith - refractionCorrection;
                     
/*
			if (solarzen < 108)
				{
					solarazimuth = azimuth;
					solarelevation = 90 - solarzen;
					if (solarzen < 90)
						{
							coszen = Math.cos(degToRad(solarzen));
						}
					else
						{
							coszen = 0;
						}
				}
			else     // do not report az & el after astro twilight
				{
					solarazimuth = -999999;
					solarelevation = -999999;
					coszen = -999999;
				}
*/
	}
	
// SECTION OF MODIFICATIONS BY JOE DEROSE:

function calcHourSpecificAngleBeforeNoon(lat, solarDec, angle)
	{
		/*
			This is a modification by Joe DeRose of the NOAA function calcHourAngleSunrise(lat, solarDec)
		*/
		/*
			***********************************************************************
			* Name:    calcHourSpecificAngleBeforeNoon
			* Type:    Function
			* Purpose: calculate the hour angle of the sun at a specific angle for the
			*         latitude
			* Arguments:
			*   lat : latitude of observer in degrees
			*   solarDec : declination angle of sun in degrees
			*   angle = angle of the sun (in degrees)
			* Return value:
			*   hour angle of sun at specific angle in radians
			***********************************************************************
		*/

		var calcHourSpecificAngleBeforeNoon;
		
        latRad = degToRad(lat);
        sdRad = degToRad(solarDec);

        HAarg = (Math.cos(degToRad(angle)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

        HA = (Math.acos(Math.cos(degToRad(angle)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));

        calcHourSpecificAngleBeforeNoon = HA;
		
		return calcHourSpecificAngleBeforeNoon;
	}


function calcHourSpecificAngleAfterNoon(lat, solarDec, angle)
	{
		/*
			This is a modification by Joe DeRose of the NOAA function calcHourAngleSunset(lat, solarDec)
		*/
		/*
			***********************************************************************
			* Name:    calcHourSpecificAngleAfterNoon
			* Type:    Function
			* Purpose: calculate the hour angle of the sun at a specific angle for the
			*         latitude
			* Arguments:
			*   lat : latitude of observer in degrees
			*   solarDec : declination angle of sun in degrees
			*   angle = angle of the sun (in degrees)
			* Return value:
			*   hour angle of sun at specific angle in radians
			***********************************************************************
		*/
		
		var calcHourSpecificAngleAfterNoon;
		
        latRad = degToRad(lat);
        sdRad = degToRad(solarDec);

        HAarg = (Math.cos(degToRad(angle)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

        HA = (Math.acos(Math.cos(degToRad(angle)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));

        calcHourSpecificAngleAfterNoon = -HA;
		
		return calcHourSpecificAngleAfterNoon;
	}

function calcTimeOfAngleBeforeNoonUTC(JD, latitude, longitude, angle)
	{
		/*
			This is a modification by Joe DeRose of the NOAA function calcSunriseUTC(JD, latitude, longitude)
		*/
		/*
			***********************************************************************
			* Name:    calcTimeOfAngleBeforeNoonUTC
			* Type:    Function
			* Purpose: calculate the Universal Coordinated Time (UTC) when sun
			*         passes a certain angle (before solar noon)
			*         for the given day at the given location on earth
			* Arguments:
			*   JD  : julian day
			*   latitude : latitude of observer in degrees
			*   longitude : longitude of observer in degrees
			*   angle = angle of the sun (in degrees)
			* Return value:
			*   time in minutes from zero Z
			***********************************************************************
		*/

		var calcTimeOfAngleBeforeNoonUTC;
		
        t = calcTimeJulianCent(JD);

// *** First pass to approximate time of angle

        eqtime = calcEquationOfTime(t);
        solarDec = calcSunDeclination(t);
        hourangle = calcHourSpecificAngleBeforeNoon(latitude, solarDec, angle);

        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
// in minutes of time
        timeUTC = 720 + timeDiff - eqtime;
// in minutes

// *** Second pass includes fractional jday in gamma calc

        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440);
        eqtime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourangle = calcHourSpecificAngleBeforeNoon(latitude, solarDec, angle);
        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;
// in minutes

        calcTimeOfAngleBeforeNoonUTC = timeUTC;
		
		return calcTimeOfAngleBeforeNoonUTC;
	}

function calcTimeOfAngleAfterNoonUTC(JD, latitude, longitude, angle)
	{
		/*
			This is a modification by Joe DeRose of the NOAA function calcSunsetUTC(JD, latitude, longitude)
		*/
		/*
			***********************************************************************
			* Name:    calcTimeOfAngleAfterNoonUTC
			* Type:    Function
			* Purpose: calculate the Universal Coordinated Time (UTC) when sun
			*         passes a certain angle (after solar noon)
			*         for the given day at the given location on earth
			* Arguments:
			*   JD  : julian day
			*   latitude : latitude of observer in degrees
			*   longitude : longitude of observer in degrees
			*   angle = angle of the sun (in degrees)
			* Return value:
			*   time in minutes from zero Z
			***********************************************************************
		*/

		var calcTimeOfAngleAfterNoonUTC;
		
        t = calcTimeJulianCent(JD);

// First calculates time of angle and approx length of day

        eqtime = calcEquationOfTime(t);
        solarDec = calcSunDeclination(t);
        hourangle = calcHourSpecificAngleAfterNoon(latitude, solarDec, angle);

        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;

// first pass used to include fractional day in gamma calc

        newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440);
        eqtime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourangle = calcHourSpecificAngleAfterNoon(latitude, solarDec, angle);

        delta = longitude - radToDeg(hourangle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqtime;
// in minutes

        calcTimeOfAngleAfterNoonUTC = timeUTC;
		
		return calcTimeOfAngleAfterNoonUTC;
	}

function timeOfAngleBeforeNoon(lat, lon, year, month, day, timezone, dlstime, angle)
    {
		/*
			This is a modification by Joe DeRose of the NOAA function sunrise(lat, lon, year, month, day, timezone, dlstime)
		*/
		/*
			***********************************************************************
			* Name:    timeOfAngleBeforeNoon
			* Type:    Main Function called by spreadsheet
			* Purpose: calculate time the sun is at a certain angle before solar noon
			*     for the entered date and location.
			* Arguments:
			*   latitude = latitude (decimal degrees)
			*   longitude = longitude (decimal degrees)
			*    NOTE: longitude is negative for western hemisphere for input cells
			*          in the spreadsheet for calls to the functions named
			*          sunrise, solarnoon, and sunset. Those functions convert the
			*          longitude to positive for the western hemisphere for calls to
			*          other functions using the original sign convention
			*          from the NOAA javascript code.
			*   year = year
			*   month = month
			*   day = day
			*   timezone = time zone hours relative to GMT/UTC (hours)
			*   dlstime = daylight savings time (0 = no, 1 = yes) (hours)
			*   angle = angle of the sun (in degrees)
			*          (90 = sun at horizon; 95 = below horizon; 85 = above horizon)
			* Return value:
			*   timeOfAngleBeforeNoon time in local time (days)
			***********************************************************************
		*/

			var timeOfAngleBeforeNoon;
			
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8
				}
            if (latitude < -89.8)
				{
					latitude = -89.8
				}
            
            JD = calcJD(year, month, day);

// Calculate timeOfAngleBeforeNoon for this date
            riseTimeGMT = calcTimeOfAngleBeforeNoonUTC(JD, latitude, longitude, angle);

// adjust for time zone and daylight savings time in minutes
            riseTimeLST = riseTimeGMT + (60 * timezone) + (dlstime * 60);

// convert to days
            timeOfAngleBeforeNoon = riseTimeLST / 1440;

			return timeOfAngleBeforeNoon;
	}

function timeOfAngleAfterNoon(lat, lon, year, month, day, timezone, dlstime, angle)
    {
		/*
			This is a modification by Joe DeRose of the NOAA function sunset(lat, lon, year, month, day, timezone, dlstime)
		*/
		/*
			***********************************************************************
			* Name:    timeOfAngleAfterNoon
			* Type:    Main Function called by spreadsheet
			* Purpose: calculate time the sun is at a certain angle after solar noon
			*     for the entered date and location.
			* For latitudes greater than 72 degrees N and S, calculations are
			* accurate to within 10 minutes. For latitudes less than +/- 72°
			* accuracy is approximately one minute.
			* Arguments:
			*   latitude = latitude (decimal degrees)
			*   longitude = longitude (decimal degrees)
			*    NOTE: longitude is negative for western hemisphere for input cells
			*          in the spreadsheet for calls to the functions named
			*          sunrise, solarnoon, and sunset. Those functions convert the
			*          longitude to positive for the western hemisphere for calls to
			*          other functions using the original sign convention
			*          from the NOAA javascript code.
			*   year = year
			*   month = month
			*   day = day
			*   timezone = time zone hours relative to GMT/UTC (hours)
			*   dlstime = daylight savings time (0 = no, 1 = yes) (hours)
			*   angle = angle of the sun (in degrees)
			*          (90 = sun at horizon; 95 = below horizon; 85 = above horizon)
			* Return value:
			*   timeOfAngleAfterNoon time in local time (days)
			***********************************************************************
		*/

		var timeOfAngleAfterNoon;
		
// change sign convention for longitude from negative to positive in western hemisphere
            longitude = lon * -1;
            latitude = lat;
            if (latitude > 89.8)
				{
					latitude = 89.8
				}
            if (latitude < -89.8)
				{
					latitude = -89.8
				}
            
            JD = calcJD(year, month, day);

// Calculate timeOfAngleAfterNoon for this date
            setTimeGMT = calcTimeOfAngleAfterNoonUTC(JD, latitude, longitude, angle);
            
// adjust for time zone and daylight savings time in minutes
            setTimeLST = setTimeGMT + (60 * timezone) + (dlstime * 60);

// convert to days
            timeOfAngleAfterNoon = setTimeLST / 1440;
			
			return timeOfAngleAfterNoon;
	}

