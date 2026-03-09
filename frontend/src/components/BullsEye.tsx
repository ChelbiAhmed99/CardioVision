import React, { useState } from 'react';

interface BullsEyeProps {
    data: number[];
}

interface TooltipInfo {
    show: boolean;
    x: number;
    y: number;
    index: number | null;
    value: number | undefined;
}

export function BullsEye({ data }: BullsEyeProps) {
    const [tooltip, setTooltip] = useState<TooltipInfo>({ show: false, x: 0, y: 0, index: null, value: undefined });

    const getColor = (val: number) => {
        // Strain standard: Blue (Normal/Good), Amber (Reduced), Cyan (Weak/Ischemic)
        if (val > -10) return 'rgba(6, 182, 212, 0.7)'; // cardio-secondary (Cyan)
        if (val > -15) return 'rgba(245, 158, 11, 0.7)'; // Amber
        return 'rgba(59, 130, 246, 0.7)'; // cardio-primary (Blue)
    };

    const getGlowColor = (val: number) => {
        if (val > -10) return 'rgba(6, 182, 212, 0.4)';
        if (val > -15) return 'rgba(245, 158, 11, 0.4)';
        return 'rgba(59, 130, 246, 0.4)';
    };

    const handleMouseMove = (e: React.MouseEvent, index: number, value: number | undefined) => {
        const rect = (e.currentTarget as SVGElement).closest('svg')?.parentElement?.getBoundingClientRect();
        if (rect) {
            setTooltip({
                show: true,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                index,
                value
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, show: false, index: null }));
    };

    const segments = [];

    const renderPath = (rOut: number, rIn: number, startAngle: number, endAngle: number, index: number) => {
        const x1 = 100 + rOut * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 100 + rOut * Math.sin((startAngle * Math.PI) / 180);
        const x2 = 100 + rOut * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 100 + rOut * Math.sin((endAngle * Math.PI) / 180);
        const bx1 = 100 + rIn * Math.cos((startAngle * Math.PI) / 180);
        const by1 = 100 + rIn * Math.sin((startAngle * Math.PI) / 180);
        const bx2 = 100 + rIn * Math.cos((endAngle * Math.PI) / 180);
        const by2 = 100 + rIn * Math.sin((endAngle * Math.PI) / 180);

        const val = data[index] || -20;
        const isHovered = tooltip.index === index;

        return (
            <path
                key={`seg-${index}`}
                d={`M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${bx2} ${by2} A ${rIn} ${rIn} 0 0 0 ${bx1} ${by1} Z`}
                fill={getColor(val)}
                stroke={isHovered ? 'white' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isHovered ? '2' : '1'}
                className="transition-all duration-300 cursor-crosshair"
                onMouseMove={(e) => handleMouseMove(e, index, val)}
                onMouseLeave={handleMouseLeave}
                style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${getGlowColor(val)})` : 'none',
                    opacity: tooltip.index !== null && !isHovered ? 0.4 : 1
                }}
            />
        );
    };

    // Basal segments (1-6)
    for (let i = 0; i < 6; i++) {
        segments.push(renderPath(90, 60, (i * 60) - 30, ((i + 1) * 60) - 30, i));
    }

    // Mid segments (7-12)
    for (let i = 0; i < 6; i++) {
        segments.push(renderPath(60, 30, (i * 60) - 30, ((i + 1) * 60) - 30, i + 6));
    }

    // Apical segments (13-16)
    for (let i = 0; i < 4; i++) {
        segments.push(renderPath(30, 10, (i * 90) - 45, ((i + 1) * 90) - 45, i + 12));
    }

    // Apex (17)
    const apexVal = data[16] || -20;
    segments.push(
        <circle
            key="seg-16"
            cx="100"
            cy="100"
            r="10"
            fill={getColor(apexVal)}
            stroke={tooltip.index === 16 ? 'white' : 'rgba(255,255,255,0.1)'}
            strokeWidth={tooltip.index === 16 ? '2' : '1'}
            className="transition-all duration-300 cursor-crosshair"
            onMouseMove={(e) => handleMouseMove(e, 16, apexVal)}
            onMouseLeave={handleMouseLeave}
            style={{
                filter: tooltip.index === 16 ? `drop-shadow(0 0 8px ${getGlowColor(apexVal)})` : 'none',
                opacity: tooltip.index !== null && tooltip.index !== 16 ? 0.4 : 1
            }}
        />
    );

    return (
        <div className="relative flex flex-col items-center glass-card p-10 group overflow-hidden border-white/5">
            <div className="absolute inset-0 bg-blue-600/5 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <svg width="240" height="240" viewBox="0 0 200 200" className="drop-shadow-2xl overflow-visible">
                {segments}
                <text x="100" y="8" textAnchor="middle" fill="white" fontSize="7" className="font-bold opacity-30 tracking-widest uppercase">Anterior</text>
                <text x="100" y="196" textAnchor="middle" fill="white" fontSize="7" className="font-bold opacity-30 tracking-widest uppercase">Inferior</text>
                <text x="194" y="102" textAnchor="middle" fill="white" fontSize="7" className="font-bold opacity-30 tracking-widest uppercase rotate-90" style={{ transformOrigin: '194px 102px' }}>Lateral</text>
                <text x="6" y="102" textAnchor="middle" fill="white" fontSize="7" className="font-bold opacity-30 tracking-widest uppercase -rotate-90" style={{ transformOrigin: '6px 102px' }}>Septal</text>
            </svg>

            {/* Tooltip */}
            <div
                className={`absolute pointer-events-none z-50 px-4 py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-150 ${tooltip.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
                style={{
                    left: `${tooltip.x + 20}px`,
                    top: `${tooltip.y + 20}px`,
                    transform: 'translate(-50%, -100%)'
                }}
            >
                <div className="flex flex-col gap-1 items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Segment {tooltip.index !== null ? tooltip.index + 1 : ''}</span>
                    <span className={`text-xl font-display font-black tracking-tighter ${tooltip.value !== undefined ? (tooltip.value > -10 ? 'text-cyan-400' : tooltip.value > -15 ? 'text-amber-400' : 'text-blue-400') : 'text-slate-400'}`}>
                        {tooltip.value?.toFixed(1) ?? '--'}%
                    </span>
                </div>
            </div>

            <div className="mt-8 flex gap-8 text-[10px] font-black tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                    <span className="text-slate-500">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
                    <span className="text-slate-500">Reduced</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"></div>
                    <span className="text-slate-500">Akinetic</span>
                </div>
            </div>
        </div>
    );
}
