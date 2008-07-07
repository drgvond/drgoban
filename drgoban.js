// 
//  drgoban.js
//  DrGoban
//  
//  Created by Dr. G. von D. on 2008-07-06.
//  Copyright 2008 Chouette Labs. All rights reserved.
// 


var Goban = function(canvas, nrLines, pixSize)
{
  	if (!canvas.getContext) 
		return;
		
	this._canvas = canvas;
	this._ctx = this._canvas.getContext("2d");
	this._nrLines = nrLines;
	this._pixSize = pixSize;
	this._sqWidth = pixSize / nrLines;
	this._status = new Array(nrLines * nrLines);
}

Goban._markZIndex = 100;
Goban._hoshiPositions = [];
(Goban._hoshiPositions[9] = DrUtils.productArray([3, 7], [3, 7])).push([5, 5]);
Goban._hoshiPositions[13] = DrUtils.productArray([4, 7, 10], [4, 7, 10]);
Goban._hoshiPositions[19] = DrUtils.productArray([4, 10, 16], [4, 10, 16]);

Goban.prototype =
{
	draw: function()
	{
        var ctx = this._ctx;

        ctx.fillStyle = "goldenrod";
        ctx.fillRect (0, 0, this._pixSize, this._pixSize);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";

		var borderCoords = this.getIntersectionCoords(1, this._nrLines);
		ctx.beginPath();
		for (var i = 1; i <= this._nrLines; ++i)
		{
			var coords = this.getIntersectionCoords(i, i);
			// Vertical
			ctx.moveTo(coords.x, this._sqWidth / 2);
			ctx.lineTo(coords.x, this._pixSize - this._sqWidth / 2 + 0.5);

			// Horizontal
			ctx.moveTo(this._sqWidth / 2, coords.y);
			ctx.lineTo(this._pixSize - this._sqWidth / 2 + 0.5, coords.y);
		}
		ctx.stroke();

		// Hoshi
		var hoshis = Goban._hoshiPositions[this._nrLines];
		if (!hoshis) return;
		ctx.fillStyle = "black";
		for (var i = 0; i < hoshis.length; ++i)
		{
			var coords = this.getIntersectionCoords(hoshis[i][0], hoshis[i][1]);
			ctx.beginPath();
			ctx.arc(coords.x, coords.y, this._sqWidth / 15, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	},
	
	getIntersectionCoords: function(row, col)
	{
		return { x: (col - 1 + 0.5) * this._sqWidth, 
				 y: (this._nrLines - row + 0.5) * this._sqWidth };
	},
	
	drawStone: function(color, row, col){
        var ctx = this._ctx;

		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		
		ctx.fillStyle = color;
		ctx.beginPath();
		var coords = this.getIntersectionCoords(row, col);
		ctx.arc(coords.x, coords.y,
				(this._sqWidth - 1.5) / 2, 0, 2 * Math.PI, true);
		// FIXME No shadows for Firefox 3
		ctx.shadowOffsetX = ctx.shadowOffsetY = 0.08 * this._sqWidth;
		ctx.shadowColor = "rgba(0, 0,0, 0.3)"
		ctx.fill();
		ctx.shadowColor = "rgba(0, 0,0, 0)"		// Don't show shadow for border. 
		ctx.stroke();
	},
	
	drawBlackStone: function(row, col)
	{
		this.drawStone("black", row, col);
	},
	
	drawWhiteStone: function(row, col)
	{
		this.drawStone("white", row, col);	
	},
	
	drawLabel: function(row, col, label, color)
	{
		var coords = this.getIntersectionCoords(row, col);
		var ctx = this._ctx;
		
		var textSize = this._sqWidth * 0.66;
		ctx.strokeStyle = color;
		if (false && ctx.strokeText)
		{
			// TODO strokeText has not been implemented yet, either in WebKit and Firefox.
			// Should be similar to mozDrawText below.
			// ctx.strokeText(label, coords.x - width / 2, coords.y + width / 2);
			// ...
		}
		else if (ctx.mozDrawText)	// Firefox 3
		{
			ctx.mozTextStyle = String(textSize) + "pt Arial";
			var width = ctx.mozMeasureText(label);
			ctx.translate(coords.x - width / 2, coords.y + width / 2);
			ctx.mozDrawText(label);
		}
		else
		{
			var text = document.createElement("div");
			this._canvas.parentNode.appendChild(text);
			text.className = "GobanLabel";
			text.id = "label-" + String(row) + "-" + String(col);
			text.style.zIndex = Goban._markZIndex;
			text.style.fontSize = String(textSize) + "px";
			text.style.color = color;
			text.innerHTML = "<i>" + label + "</i>";
			text.style.position = "absolute";
			text.style.left = String(coords.x - text.offsetWidth / 2) + "px";
			text.style.top = String(coords.y - text.offsetHeight / 2) + "px";
		}
	},
	
	drawBlackLabel: function(row, col, label)
	{
		this.drawLabel(row, col, label, "black");
	},
	
	drawWhiteLabel: function(row, col, label)
	{
		this.drawLabel(row, col, label, "white");
	}
}
