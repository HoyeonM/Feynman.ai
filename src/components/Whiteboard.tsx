
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Eraser, Pencil, Trash2, Image, Download, Move, MinusCircle, PlusCircle } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface DrawingLine {
  points: Point[];
  color: string;
  width: number;
}

export const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Redraw canvas with all lines
  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    
    lines.forEach(line => {
      if (line.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
    
    ctx.restore();
  };

  // Handle drawing
  useEffect(() => {
    redrawCanvas();
  }, [lines, position, scale]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - position.x) / scale;
    const y = (clientY - rect.top - position.y) / scale;
    
    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      const newLine: DrawingLine = {
        points: [{ x, y }],
        color: tool === 'eraser' ? '#FFFFFF' : color,
        width: tool === 'eraser' ? lineWidth * 3 : lineWidth,
      };
      setCurrentLine(newLine);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentLine || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling on touch devices
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - position.x) / scale;
    const y = (clientY - rect.top - position.y) / scale;
    
    setCurrentLine(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, { x, y }],
      };
    });
  };

  const endDrawing = () => {
    if (isDrawing && currentLine) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
    setIsDrawing(false);
  };

  const handleStartPan = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && tool === 'move')) {
      setIsPanning(true);
    }
  };

  const handlePan = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const handleEndPan = () => {
    setIsPanning(false);
  };

  const clearCanvas = () => {
    setLines([]);
    redrawCanvas();
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleZoom = (factor: number) => {
    setScale(prev => {
      const newScale = prev * factor;
      return Math.min(Math.max(newScale, 0.5), 3);
    });
  };

  const colorOptions = [
    '#000000', '#FF0000', '#0000FF', '#008000', 
    '#FFA500', '#800080', '#A52A2A', '#808080'
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-3 bg-secondary flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setTool('pencil')} 
            className={cn("p-2 rounded-md", tool === 'pencil' ? "bg-primary text-primary-foreground" : "hover:bg-gray-200")}
            aria-label="Pencil tool"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => setTool('eraser')} 
            className={cn("p-2 rounded-md", tool === 'eraser' ? "bg-primary text-primary-foreground" : "hover:bg-gray-200")}
            aria-label="Eraser tool"
          >
            <Eraser size={18} />
          </button>
          <button 
            onClick={() => setTool('move')} 
            className={cn("p-2 rounded-md", tool === 'move' ? "bg-primary text-primary-foreground" : "hover:bg-gray-200")}
            aria-label="Move tool"
          >
            <Move size={18} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <div className="flex space-x-1">
            {colorOptions.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "w-5 h-5 rounded-full border", 
                  color === c ? "ring-2 ring-primary" : ""
                )}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleZoom(0.9)} 
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Zoom out"
          >
            <MinusCircle size={18} />
          </button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => handleZoom(1.1)} 
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Zoom in"
          >
            <PlusCircle size={18} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            onClick={clearCanvas} 
            className="p-2 rounded-md hover:bg-gray-200 text-red-500"
            aria-label="Clear canvas"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={downloadCanvas} 
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Download canvas"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="whiteboard-container flex-1 relative overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className={cn("absolute top-0 left-0 w-full h-full", isPanning || tool === 'move' ? "cursor-move" : "")}
          onMouseDown={(e) => {
            handleStartPan(e);
            startDrawing(e);
          }}
          onMouseMove={(e) => {
            handlePan(e);
            draw(e);
          }}
          onMouseUp={() => {
            handleEndPan();
            endDrawing();
          }}
          onMouseLeave={() => {
            handleEndPan();
            endDrawing();
          }}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
    </div>
  );
};
