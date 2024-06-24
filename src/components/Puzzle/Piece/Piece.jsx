/* TO DO: 
    -Solve the shape of the bottom line of the piece; When the bottom line is an inner hole, the shape is drawn correctly, but the clipping is not working properly, causing the image to be drawn outside the piece. Meanwhile, given the fact that an outer hole is well drawn, the pattern of the puzzle will be an fixed outer hole in the bottom line.
*/

import { useEffect, useRef } from 'react';

function Piece({ 
    img = '/assets/img/golden.jpg', 
    puzzleSize = [3, 3], 
    i=2, j=0 
}){
    //[top, right, bottom, left]
    const holes = [
        i !== 0,
        j !== puzzleSize[1]-1,
        i !== puzzleSize[0]-1,
        j !== 0
    ];
    const inner = [
        true,
        i % 2 !== j % 2,
        false,
        i % 2 !== j % 2
    ];

    const size = 1000;
    const radius = 170;
    const offset = 140;
    const outlineWidth = 20;
    const width = size + 2*(radius+offset+outlineWidth);
    const height = size + 2*(radius+offset+outlineWidth);
    const xOffset = Math.sqrt(Math.pow(radius, 2) - Math.pow(offset, 2));
    const linesWidth = (size / 2) - xOffset;
    const xOrigin = (width-size)/2;
    const yOrigin = (height-size)/2;

    const settings = {
        size,
        radius,
        offset,
        outlineWidth,
        width,
        height,
        xOffset,
        linesWidth,
        xOrigin,
        yOrigin
    }

    //const sizes = {


    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    const drawOutline = (ctx, settings, holes, inner) => {
        const {
            size, 
            radius, 
            offset, 
            outlineWidth, 
            width, 
            height,
            xOffset,
            linesWidth,
            xOrigin,
            yOrigin
        } = settings;

        ctx.moveTo(0,0);
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

    }
    const drawPiece = (ctx, settings, holes, inner) => {
        const {
            size,
            outlineWidth, 
            width, 
            height,
            xOrigin,
            yOrigin,
            imgWidth,
            imgHeight
        } = settings;

        const aspRatio = imgWidth/imgHeight;
        const [n, m] = puzzleSize;

        const xImgOffset = aspRatio > m/n ? 0.5*size*(aspRatio*n - m) : 0;
        const yImgOffset = aspRatio < m/n ? 0.5*size*((m/aspRatio) - n) : 0;

        ctx.beginPath();

        drawOutline(ctx, settings, holes, inner);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = outlineWidth;
        ctx.stroke();
        ctx.rect(xOrigin, yOrigin, size, size);
        
        ctx.clip();



        ctx.drawImage(imgRef.current, xOrigin - j*size, yOrigin - i*size, size*m + xImgOffset, size*n + yImgOffset);     

    }


    const handleLoad = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const newSettings = {
            ...settings,
            imgWidth: e.target.width,
            imgHeight: e.target.height
        }

        drawPiece(ctx, newSettings, holes, inner);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        drawOutline(ctx, settings, holes, inner);


    }, []);

    return (
        <>
        <canvas ref={canvasRef} width={settings.width} height={settings.height}></canvas>
        <img src={img} alt="nope" ref={imgRef} onLoad={handleLoad} style={{display: 'none'}}/>
        </>
    )
}

export default Piece;