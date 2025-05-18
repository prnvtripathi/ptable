"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { periodicTableData } from "@/data/periodicTableData";
import AtomVisualization from "@/components/atom-visualization";
import { elementTypeColors } from "@/data/elementTypeColors";
import { FaWikipediaW } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const metadata = {
  title: "Periodic Table",
  description: "Explore the periodic table of elements with detailed information and visualizations.",
};

export default function Home() {
  const [activeElement, setActiveElement] = useState(null);
  const [highlightedCategory, setHighlightedCategory] = useState(null);

  const handleElementClick = (element) => setActiveElement(element);
  const closeDialog = () => setActiveElement(null);
  const handleCategoryClick = (category) => {
    setHighlightedCategory(prev => prev === category ? null : category);
  };

  const uniqueCategories = [...new Set(periodicTableData.map(e => e.category))];

  return (
    <div className="p-4 md:p-6 bg-black text-white min-h-screen font-sans">
      <div className="max-w-full mx-auto xl:max-w-7xl">

        {/* Category Legend */}
        <div className="mb-6 p-3 bg-gray-900/60 border border-gray-800 rounded-lg shadow-md">
          <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center">
            {uniqueCategories.map(category => {
              const categoryKey = category?.toLowerCase().replace(/\s+/g, '-') || "unknown";
              const isHighlighted = highlightedCategory === category;

              return (
                <div
                  key={category}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer transition-colors",
                    isHighlighted ? "bg-gray-700/50 ring-1 ring-gray-500" : "hover:bg-gray-800/50"
                  )}
                  onClick={() => handleCategoryClick(category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(category);
                    }
                  }}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-sm",
                    elementTypeColors[categoryKey]?.split(' ')[0] || "bg-gray-500/60"
                  )}></div>
                  <span className="text-xs text-gray-300">{category}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Periodic Table Grid */}
        <div className="w-full overflow-x-auto">
          <div className="grid min-w-[1100px] grid-cols-18 gap-1.5 bg-gray-900/40 p-2 md:p-4 border border-gray-800 rounded-lg shadow-lg">
            {periodicTableData.map((element) => {
              const isHighlighted = highlightedCategory === element.category;
              const shouldDarken = highlightedCategory && !isHighlighted;

              return (
                <div
                  key={element.symbol}
                  className={cn(
                    "element-box cursor-pointer p-1 md:p-1.5 text-center text-white shadow-md transition-all duration-300 rounded-xs flex flex-col justify-center items-center aspect-square",
                    elementTypeColors[element.category.toLowerCase().replace(/\s+/g, '-')] || "bg-gray-600/60 border border-gray-500",
                    {
                      'opacity-25 blur-sm filter grayscale-[75%]': activeElement && activeElement.symbol !== element.symbol,
                      'scale-110 ring-2 ring-sky-400 ring-offset-2 ring-offset-black z-10 relative': activeElement && activeElement.symbol === element.symbol,
                      'opacity-30 grayscale-[60%]': shouldDarken,
                      'scale-105 brightness-125 z-10': isHighlighted && !activeElement,
                      'hover:brightness-125': !shouldDarken,
                    }
                  )}
                  style={{ gridColumn: element.xpos, gridRow: element.ypos }}
                  onClick={() => handleElementClick(element)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleElementClick(element);
                    }
                  }}
                >
                  <div className="text-[0.55rem] sm:text-xs opacity-80">{element.atomicNumber}</div>
                  <div className="text-[0.7rem] sm:text-base md:text-lg font-bold">{element.symbol}</div>
                  <div className="text-[0.5rem] sm:text-[0.65rem] truncate w-full px-0.5">{element.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Element Details Dialog */}
      <Dialog open={!!activeElement} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="bg-gray-900/95 border border-sky-600/70 text-white w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-4 sm:p-5 md:p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {activeElement && (
            <>
              <DialogHeader className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3">
                  <FaWikipediaW
                    className="text-gray-400 hover:text-white text-2xl sm:text-3xl cursor-pointer transition-colors"
                    onClick={() => window.open(`https://en.wikipedia.org/wiki/${activeElement.name}`, '_blank')}
                    aria-label={`Wikipedia page for ${activeElement.name}`}
                  />
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-300">
                    {activeElement.name} ({activeElement.symbol})
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Atom Visualization */}
                <div className="flex-1 flex items-center justify-center p-1">
                  <AtomVisualization
                    atomicNumber={activeElement.atomicNumber}
                    category={activeElement.category}
                  />
                </div>

                {/* Element Info */}
                <div className="flex-1 p-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm md:text-base bg-black/40 p-3 sm:p-4 rounded-lg border border-gray-800/70 mb-4">
                    <div><span className="font-semibold text-gray-400">Atomic Number:</span> {activeElement.atomicNumber}</div>
                    <div><span className="font-semibold text-gray-400">Atomic Mass:</span> {activeElement.atomicMass} amu</div>
                    <div className="sm:col-span-2"><span className="font-semibold text-gray-400">Category:</span> {activeElement.category}</div>
                    <div className="sm:col-span-2"><span className="font-semibold text-gray-400">Electron Config:</span> <span className="truncate block" title={activeElement.electronConfiguration}>{activeElement.electronConfiguration}</span></div>
                    <div><span className="font-semibold text-gray-400">Electronegativity:</span> {activeElement.electronegativity ?? 'N/A'}</div>
                    <div><span className="font-semibold text-gray-400">Atomic Radius:</span> {activeElement.atomicRadius ? `${activeElement.atomicRadius} pm` : 'N/A'}</div>
                    <div><span className="font-semibold text-gray-400">Ionization Energy:</span> {activeElement.ionizationEnergy ? `${activeElement.ionizationEnergy} kJ/mol` : 'N/A'}</div>
                    <div><span className="font-semibold text-gray-400">Density:</span> {activeElement.density ? `${activeElement.density} g/cm³` : 'N/A'}</div>
                    <div><span className="font-semibold text-gray-400">Melting Point:</span> {activeElement.meltingPoint ? `${activeElement.meltingPoint} K` : 'N/A'}</div>
                    <div><span className="font-semibold text-gray-400">Boiling Point:</span> {activeElement.boilingPoint ? `${activeElement.boilingPoint} K` : 'N/A'}</div>
                    <div className="sm:col-span-2"><span className="font-semibold text-gray-400">Discovered By:</span> {activeElement.discoveredBy ?? 'N/A'}</div>
                  </div>

                  {/* Description */}
                  {activeElement.description && (
                    <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-gray-800/70">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-sky-400">Summary</h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{activeElement.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
