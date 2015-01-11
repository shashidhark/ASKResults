/*
|===============================================================================
|  Last Modified Date 	: 28/08/2014
|  Developer   				  : Shashidhar and Alwyn
|===============================================================================
|	Arguments:
|	 	t : Total marls
|		s : Semester
|		b : branch
|
|	Returns:
|	  Average Marks.
|		Formula used: (Total/MaxMarks)*100.
|===============================================================================
*/

var BE_BRANCH = ['AU', 'BM', 'CV', 'EC', 'EE', 'BT', 'CS', 'ME', 'EV', 'IM', 'IP', 'IS', 'CH', 'IT',
								 'MI', 'ML', 'TE', 'CT', 'AE', 'MT', 'TL', 'PR', 'EI', 'PC', 'MR', 'NT'];

								  /* 	1				2			3				4			5				6				7			8			9				10			11		12		13*/
var MTECH_BRANCH = [  'CCS', 'EPE', 'EPS', 'LDC', 'LDE', 'LDS', 'LEC', 'LEL', 'LIE', 'LPE', 'MMD', 'MPD', 'MPE',
											'MPM', 'MPY', 'CSE', 'MCM', 'MDE', 'MPT', 'MSE', 'MTE',	'MTP', 'LVS', 'LNI', 'LDN', 'SCN',
											'SIT', 'CNT', 'EMS', 'FTE', 'HCE', 'SCE', 'SCS', 'LSP',	'MAU', 'CCT', 'CEE', 'CGT', 'JTT',
											'LBI', 'LCS', 'MEM', 'SSE', 'MEA', 'MAE', 'ECD', 'CTM',	'MCS', 'BBT', 'BBI', 'MAR', 'CGI',
											'MTR', 'BBC', 'MIA', 'MCE', 'MAP'];

var MAX_MARKS={
							// BE   [0,  1,  2,   3,   4,   5,   6,   7,    8  ]
							'BE'  : [0, 775, 775, 900, 900, 900, 900, 900, 750 ], //CS & E

							// Architecture
							//			[0, 1,  	2,   	3,   	4,   5,    6,    7,    8,   9,   10 ]
							'AT'  : [0, 1000, 1200, 1100, 950, 1250, 1200, 1200, 800, 300, 300],

							//M-Tech[0,  1,  2,   3,   4,  ]
							'MTECH' : [0, 800, 800, 500, 300 ], //MTech

							// MBA  [0, 1,   2,   3,   4,   ]
							'MBA' : [0, 900, 900, 900, 1200 ],

							// MCA  [0, 1,    2,    3,    4,    5,    6   ]
							'MCA' : [0, 1050, 1050, 1050, 1050, 1050, 250 ]
            };

function getAvgMarks(t, s, b){
	var branch;
	switch(b.length){
		case 2:
						if(BE_BRANCH.indexOf(b) > -1){
								branch = 'BE';
						}
						else if(b=='AT')
							branch = 'AT';
						else
							branch = 0;
						break;
    	case 3:
						if(MTECH_BRANCH.indexOf(b) > -1){
								branch = 'MTECH';
						}
						else if(b=='MCA')
							branch = b;
						else if(b=='MBA'){
							branch=b;
						}
						else
							branch=0;
						break;
		default:
						branch = 0;
	}

	if(branch == 0){
		return '';
	}
	else{
		//alert(branch+"]["+s);
		return ((t/MAX_MARKS[branch][s])*100).toFixed(2);
	}
}
