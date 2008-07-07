// 
//  drutils.js
//  DrGoban
//  
//  Created by Dr. G. von D. on 2008-07-07.
//  Copyright 2008 Chouette Labs. All rights reserved.
// 


var DrUtils = {
	// Cartesian product of two arrays.
	productArray: function(arr1, arr2)
	{
		var res = [];
		for (var i = 0; i < arr1.length; ++i)
			for (var j = 0; j < arr1.length; ++j)
				res.push([arr1[i], arr2[j]]);
				
		return res;
	}
}
