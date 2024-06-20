import { useEffect, useRef } from 'react';

function Piece() {
    const puzzleSize = [5, 5];
    const [i, j] = [1, 3];

    

    //[top, right, bottom, left]
    const holes = [
        i !== 0,
        j !== puzzleSize[1]-1,
        i !== puzzleSize[0]-1,
        j !== 0
    ];
    const inner = [
        i % 2 === j % 2,
        i % 2 !== j % 2,
        i % 2 === j % 2,
        i % 2 !== j % 2
    ];

    const size = 1000;
    const radius = 150;
    const offset = 120;
    const outlineWidth = 5;

    const width = size+2*(radius+offset+outlineWidth);
    const height = size+2*(radius+offset+outlineWidth);

    const canvasRef = useRef(null);

    useEffect(() => {
        const xOffset = Math.sqrt(Math.pow(radius, 2) - Math.pow(offset, 2));
        const linesWidth = (size / 2) - xOffset;
        const xOrigin = (width-size)/2;
        const yOrigin = (height-size)/2;
        

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'red';
        ctx.lineWidth = outlineWidth;


        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.clearRect(0, 0, width, height);
        //TOP LINE
        ctx.moveTo(xOrigin, yOrigin);
        ctx.lineTo(linesWidth + xOrigin, yOrigin);
        if(holes[0])
            ctx.arc(linesWidth + xOrigin + xOffset, yOrigin - (inner[0] ? -offset : offset), radius, Math.PI + (inner[0] ? 1 : -1)*Math.asin(offset/radius), 2*Math.PI+(inner[0] ? -1 : 1)*Math.asin(offset/radius), inner[0]);
        else
            ctx.lineTo(xOrigin + size, yOrigin);
        
        ctx.moveTo(linesWidth + xOrigin + 2*xOffset, yOrigin);
        ctx.lineTo(xOrigin + size, yOrigin);

        //RIGHT LINE
        ctx.moveTo(xOrigin + size, yOrigin);
        ctx.lineTo(xOrigin + size, yOrigin + linesWidth);
        if(holes[1])
            ctx.arc(xOrigin + size + (inner[1] ? -offset : offset), yOrigin + linesWidth + xOffset, radius, -Math.PI/2 + (inner[1] ? 1 : -1)*Math.asin(offset/radius), Math.PI/2 + (inner[1] ? -1 : 1)*Math.asin(offset/radius), inner[1]);
        else
            ctx.lineTo(xOrigin + size, yOrigin + size);
        ctx.moveTo(xOrigin + size, yOrigin + linesWidth + 2*xOffset);
        ctx.lineTo(xOrigin + size, yOrigin + size);
        
        //BOTTOM LINE
        ctx.moveTo(xOrigin, yOrigin + size);
        ctx.lineTo(xOrigin + linesWidth, yOrigin + size);
        if(holes[2])
            ctx.arc(linesWidth + xOrigin + xOffset, yOrigin + size + (inner[2] ? -offset : offset), radius, Math.PI + (inner[2] ? -1 : 1)*Math.asin(offset/radius), 2*Math.PI+(inner[2] ? 1 : -1)*Math.asin(offset/radius), !inner[2]);
        else
            ctx.lineTo(xOrigin + size, yOrigin + size);
        ctx.moveTo(linesWidth + xOrigin + 2*xOffset, yOrigin + size);
        ctx.lineTo(xOrigin + size, yOrigin + size);

        //LEFT LINE
        ctx.moveTo(xOrigin, yOrigin + linesWidth + 2*xOffset);
        ctx.lineTo(xOrigin, yOrigin + size);
        
        if(holes[3])
            ctx.arc(xOrigin - (inner[3] ? -offset : offset), yOrigin + linesWidth + xOffset, radius, Math.PI/2 + (inner[3] ? 1 : -1)*Math.asin(offset/radius), -Math.PI/2 + (inner[3] ? -1 : 1)*Math.asin(offset/radius), inner[3]);
        else
            ctx.lineTo(xOrigin, yOrigin);
        ctx.moveTo(xOrigin, yOrigin);
        ctx.lineTo(xOrigin, yOrigin + linesWidth);
        
        ctx.closePath();
        ctx.stroke();

    }, []);

    return (
        <canvas ref={canvasRef} width={width} height={height}></canvas>
    )
}

export default Piece;