import { elementTypeColors } from "@/data/elementTypeColors";
import React from 'react';
import { cn } from "@/lib/utils";

// Atom Visualization Component
const AtomVisualization = ({ atomicNumber, category }) => {
    // Configuration for electron shells: radius, max electrons, animation speed factor
    const shellsConfig = [
        { radius: 35, maxElectrons: 2, speedFactor: 2.5 },
        { radius: 60, maxElectrons: 8, speedFactor: 5 },
        { radius: 85, maxElectrons: 18, speedFactor: 7.5 }, // Simplified max for visualization
        { radius: 110, maxElectrons: 32, speedFactor: 10 }, // Simplified max for visualization
    ];

    let electronsToPlace = atomicNumber;

    // Determine nucleus color from elementTypeColors, using a more opaque version
    const categoryKey = category?.toLowerCase().replace(/\s+/g, '-') || "unknown";
    const nucleusColorClass = elementTypeColors[categoryKey]?.split(' ')[0].replace('/30', '/80') || 'bg-gray-400/80';

    const shells = shellsConfig.map((shellConfig, shellIndex) => {
        if (electronsToPlace <= 0 && shellIndex > 0) return null; // Don't render empty outer shells if no more electrons

        const electronsInThisShell = Math.min(electronsToPlace, shellConfig.maxElectrons);
        electronsToPlace -= electronsInThisShell;

        if (electronsInThisShell === 0 && shellIndex > 0) { // Avoid rendering empty shells unless it's the first one for Hydrogen
            const previousShellsHadElectrons = shellsConfig.slice(0, shellIndex).some((prevShell, prevIdx) => {
                let tempElectrons = atomicNumber;
                for (let k = 0; k < prevIdx; k++) tempElectrons -= shellsConfig[k].maxElectrons;
                return Math.min(tempElectrons, shellsConfig[prevIdx].maxElectrons) > 0;
            });
            if (!previousShellsHadElectrons && atomicNumber > 0 && electronsInThisShell === 0) {
                // This case is tricky, might need to ensure at least one shell shows for Hydrogen if it lands here
            } else if (electronsInThisShell === 0) {
                return null;
            }
        }


        const electronElements = [];
        for (let i = 0; i < electronsInThisShell; i++) {
            const angle = (360 / electronsInThisShell) * i;
            electronElements.push(
                <div
                    key={`e-${shellIndex}-${i}`}
                    className="electron absolute w-[7px] h-[7px] bg-sky-400 rounded-full shadow-[0_0_5px_1px_rgba(56,189,248,0.7)]"
                    style={{
                        // Position electrons on the orbit path of the rotating shell
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'center',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${shellConfig.radius}px) rotate(-${angle}deg)`,
                    }}
                />
            );
        }

        // Only render shell if it has electrons or it's the first shell (for elements like H)
        if (electronsInThisShell > 0 || (shellIndex === 0 && atomicNumber > 0 && electronsInThisShell === 0 && atomicNumber <= shellConfig.maxElectrons)) {
            // The condition for H with 0 electrons in shell 0 is complex if electronsToPlace was already 0.
            // A simpler rule: if atomicNumber > 0 and this is the first shell, it should have electrons if atomicNumber <= maxElectrons.
            // The current logic should place Hydrogen's electron in the first shell.
        } else if (electronsInThisShell === 0) {
            return null;
        }


        return (
            <div
                key={`shell-${shellIndex}`}
                className="shell absolute border border-dashed border-gray-700 rounded-full"
                style={{
                    width: `${shellConfig.radius * 2}px`,
                    height: `${shellConfig.radius * 2}px`,
                    animation: `spin ${shellConfig.speedFactor + (shellIndex * 1.5)}s linear infinite ${shellIndex % 2 === 0 ? '' : 'reverse'}`,
                }}
            >
                {electronElements}
            </div>
        );
    }).filter(Boolean); // Remove null entries

    return (
        <div className="atom-visualization-area mt-6 p-4 border border-gray-800 rounded-md bg-black/20">
            <h3 className="text-lg font-semibold mb-3 text-sky-300 text-center">Atomic Structure</h3>
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                <div className={cn(
                    "nucleus w-10 h-10 rounded-full absolute z-10 shadow-xl flex items-center justify-center text-sm font-bold text-white",
                    nucleusColorClass
                )}>
                    {atomicNumber}p
                </div>
                {shells}
            </div>
        </div>
    );
};

export default AtomVisualization;