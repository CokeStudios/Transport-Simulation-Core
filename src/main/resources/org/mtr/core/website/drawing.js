import {atan45, rotate, trig45} from "./utilities.js";

const tan225 = Math.tan(Math.PI / 8);

export function connectStations(positionAttribute, index, canvasX1, canvasY1, canvasX2, canvasY2, direction1, direction2, offset1, offset2, colorOffset, scale, quit = false) {
	const getOffsetX = direction => {
		switch (direction % 4) {
			case 0:
				return 1;
			case 1:
				return Math.SQRT1_2;
			case 2:
				return 0;
			case 3:
				return Math.SQRT1_2;
		}
	};

	const getOffsetY = direction => {
		switch (direction % 4) {
			case 0:
				return 0;
			case 1:
				return -Math.SQRT1_2;
			case 2:
				return 1;
			case 3:
				return Math.SQRT1_2;
		}
	};

	const direction = (direction2 - direction1 + 4) % 4;
	const [x, y] = rotate(canvasX2 - canvasX1, canvasY2 - canvasY1, -direction1);
	const [offset1X] = rotate(offset1 * getOffsetX(direction1), offset1 * getOffsetY(direction1), -direction1);
	const [offset2X, offset2Y] = rotate(offset2 * getOffsetX(direction2), offset2 * getOffsetY(direction2), -direction1);
	const newColorOffset = (direction1 < 2 ? 1 : -1) * colorOffset;
	const signX = Math.sign(x);
	const signY = Math.sign(y);
	const extraX = Math.max(0, Math.abs(x) - Math.abs(y)) * signX;
	const extraY = Math.max(0, Math.abs(y) - Math.abs(x)) * signY;
	const halfExtraX = extraX / 2;
	const halfExtraY = extraY / 2;
	const halfX = x / 2;
	const halfY = y / 2;
	const quadrant = x > 0 === y > 0 ? -1 : 1;
	const horizontal = Math.abs(x) > Math.abs(y);
	const points = [];

	if (direction === 0) {
		points.push([offset1X, 0, false]);
		if (horizontal) {
			const diagonalLength = Math.abs(y / 3);
			points.push([signX * diagonalLength + newColorOffset * tan225, halfY + quadrant * newColorOffset, true]);
			points.push([x - signX * diagonalLength + newColorOffset * tan225, halfY + quadrant * newColorOffset, true]);
		} else {
			points.push([offset1X, halfExtraY - quadrant * offset1X + quadrant * newColorOffset * Math.SQRT2, true]);
		}
		points.push([x + offset2X, y]);
	} else if (direction === 2) {
		points.push([offset1X, 0, false]);
		points.push([signX * Math.abs((horizontal ? y : x) * 2 / 3) + quadrant * colorOffset * Math.SQRT2 - quadrant * offset2Y, y + offset2Y, true]);
		points.push([x, y + offset2Y]);
	} else if (quadrant > 0 && direction === 3 || quadrant < 0 && direction === 1) {
		points.push([offset1X, 0, false]);
		if (horizontal) {
			points.push([signX * Math.abs(y / 3) + newColorOffset * tan225, halfY + quadrant * newColorOffset, false]);
		}
		points.push([x + offset2X, y + offset2Y]);
	} else if (horizontal) {
		points.push([offset1X, 0, false]);
		points.push([x / 3 + newColorOffset * tan225, y + signY * Math.abs(x / 3) + quadrant * newColorOffset, false]);
		points.push([x + offset2X, y + offset2Y]);
	}

	if (points.length === 0) {
		if (quit) {
			console.error("Line not drawn", quadrant, direction);
		} else {
			connectStations(positionAttribute, index, canvasX2, canvasY2, canvasX1, canvasY1, direction2, direction1, offset2, offset1, colorOffset, scale, true);
		}
	} else {
		const newPoints = [];

		for (let i = 1; i < points.length; i++) {
			const [point1X, point1Y, start45] = points[i - 1];
			const [point2X, point2Y] = points[i];
			const [x1, y1] = rotate(point1X, point1Y, direction1);
			const [x2, y2] = rotate(point2X, point2Y, direction1);
			connectWith45(newPoints, x1 + canvasX1, y1 + canvasY1, x2 + canvasX1, y2 + canvasY1, ((direction1 % 2) === 0) === start45);
		}

		for (let i = 1; i < newPoints.length; i++) {
			const [point1X, point1Y] = newPoints[i - 1];
			const [point2X, point2Y] = newPoints[i];
			drawLine(positionAttribute, index + i * 6, point1X, point1Y, point2X, point2Y, scale);
		}

		for (let i = 0; i < 6; i++) {
			drawLine(positionAttribute, index + newPoints.length * 6 + i * 6, 0, 0, 0, 0, 0);
		}
	}
}

function connectWith45(points, x1, y1, x2, y2, start45) {
	const x = x2 - x1;
	const y = y2 - y1;
	const extraX = Math.max(0, Math.abs(x) - Math.abs(y)) * Math.sign(x);
	const extraY = Math.max(0, Math.abs(y) - Math.abs(x)) * Math.sign(y);
	const x3 = start45 ? x2 - extraX : x1 + extraX;
	const y3 = start45 ? y2 - extraY : y1 + extraY;
	points.push([x1, y1]);
	points.push([x3, y3]);
	points.push([x2, y2]);
}

function drawLine(positionAttribute, index, x1, y1, x2, y2, scale) {
	const angle = atan45(y2 - y1, x2 - x1);
	const [endOffsetX1, endOffsetY1] = trig45(angle + 2, 3 * scale);
	const [endOffsetX2, endOffsetY2] = trig45(angle, tan225 * 3 * scale);
	positionAttribute.setXYZ(index + 0, x1 + endOffsetX1 - endOffsetX2, -(y1 + endOffsetY1 - endOffsetY2), -2);
	positionAttribute.setXYZ(index + 1, x2 + endOffsetX1 + endOffsetX2, -(y2 + endOffsetY1 + endOffsetY2), -2);
	positionAttribute.setXYZ(index + 2, x2 - endOffsetX1 + endOffsetX2, -(y2 - endOffsetY1 + endOffsetY2), -2);
	positionAttribute.setXYZ(index + 3, x2 - endOffsetX1 + endOffsetX2, -(y2 - endOffsetY1 + endOffsetY2), -2);
	positionAttribute.setXYZ(index + 4, x1 - endOffsetX1 - endOffsetX2, -(y1 - endOffsetY1 - endOffsetY2), -2);
	positionAttribute.setXYZ(index + 5, x1 + endOffsetX1 - endOffsetX2, -(y1 + endOffsetY1 - endOffsetY2), -2);
}
