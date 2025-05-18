"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";
import { periodicTableData } from "@/data/periodicTableData";
import AtomVisualization from "@/components/atom-visualization";
import { elementTypeColors } from "@/data/elementTypeColors";
import { FaWikipediaW } from "react-icons/fa6"; // Importing Wikipedia icon for links


export default function Home() {
  // State for the element whose details are currently shown in the dialog
  const [activeElement, setActiveElement] = useState(null);
  // State for the currently highlighted category
  const [highlightedCategory, setHighlightedCategory] = useState(null);

  // Handler for clicking an element tile
  const handleElementClick = (element) => {
    setActiveElement(element); // Set the element to be shown in the dialog
  };

  // Function to close the dialog
  const closeDialog = () => {
    setActiveElement(null);
  };

  // Handler for clicking a category in the legend
  const handleCategoryClick = (category) => {
    // If the category is already highlighted, clear the highlight
    if (highlightedCategory === category) {
      setHighlightedCategory(null);
    } else {
      setHighlightedCategory(category);
    }
  };

  // Get unique categories for the legend
  const uniqueCategories = [...new Set(periodicTableData.map(element => element.category))];

  return (
    <>
      {/* Global styles (e.g., for Inter font if not globally set elsewhere) */}
      <style jsx global>{`
                body {
                    font-family: 'Inter', sans-serif;
                }
                /* Custom scrollbar for dialog content if needed */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(128,128,128,0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(128,128,128,0.7);
                }
            `}</style>

      <div className="p-4 md:p-6 bg-black text-white min-h-screen font-sans">
        <div className="max-w-full mx-auto xl:max-w-7xl"> {/* Adjusted max-width for wider screens */}
          {/* Legend for element categories */}
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
          <div className="grid grid-cols-18 gap-1 bg-gray-900/40 p-2 md:p-4 border border-gray-800 rounded-lg shadow-lg">
            {periodicTableData.map((element) => {
              const isHighlighted = highlightedCategory === element.category;
              const shouldDarken = highlightedCategory !== null && !isHighlighted;

              return (
                <div
                  key={element.symbol}
                  className={cn(
                    "element-box cursor-pointer p-1 md:p-1.5 text-center text-white shadow-md transition-all duration-300 rounded-md flex flex-col justify-center items-center aspect-square",
                    elementTypeColors[element.category.toLowerCase().replace(/\s+/g, '-')] || "bg-gray-600/60 border border-gray-500",
                    {
                      'opacity-25 blur-sm filter grayscale-[75%]': activeElement && activeElement.symbol !== element.symbol,
                      'scale-110 ring-2 ring-sky-400 ring-offset-2 ring-offset-black z-10 relative': activeElement && activeElement.symbol === element.symbol,
                      'opacity-30 grayscale-[60%]': shouldDarken,
                      'scale-105 brightness-125 z-10': isHighlighted && !activeElement,
                      'hover:brightness-125': !shouldDarken // Apply hover effect except when darkened
                    }
                  )}
                  style={{ gridColumn: element.xpos, gridRow: element.ypos }}
                  onClick={() => handleElementClick(element)}
                  role="button" // Semantic role
                  tabIndex={0} // Make it focusable
                  onKeyDown={(e) => {
                    // Accessibility: handle keyboard navigation - activate on Enter or Space
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

        {/* Custom Dialog for Element Details */}
        {activeElement && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-40 p-4 transition-opacity duration-300 ease-in-out"
            onClick={closeDialog} // Click on backdrop closes dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialogTitle"
          >
            <div
              className="bg-gray-900/95 border border-sky-600/70 text-white max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full p-4 sm:p-5 md:p-6 rounded-xl shadow-2xl relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()} // Prevent dialog close when clicking inside
            >
              {/* Dialog Header */}
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="flex items-center gap-3">
                  <FaWikipediaW className="text-gray-400 hover:text-white text-2xl sm:text-3xl cursor-pointer transition-colors"
                    onClick={() => window.open(`https://en.wikipedia.org/wiki/${activeElement.name}`, '_blank')}
                    aria-label={`Wikipedia page for ${activeElement.name}`}
                  />
                  <h2 id="dialogTitle" className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-300">{activeElement.name} ({activeElement.symbol})</h2>
                </div>
                <button
                  onClick={closeDialog}
                  className="text-gray-400 hover:text-white text-2xl sm:text-3xl font-light leading-none p-1 -mt-1 -mr-1 rounded-full hover:bg-gray-700/50 transition-colors"
                  aria-label="Close dialog"
                >
                  &times;
                </button>
              </div>

              {/* Dialog Content: Atom Visualization and Details */}
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 -mr-2 md:pr-2 md:-mr-3">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
                  {/* Atom Visualization (Left on MD+, Top on SM) */}
                  <div className="w-full md:w-[40%] lg:w-[35%] p-1 md:p-2 flex items-center justify-center order-1 md:order-none">
                    {/* Ensure AtomVisualization is responsive or has a defined size */}
                    <AtomVisualization atomicNumber={activeElement.atomicNumber} category={activeElement.category} />
                  </div>

                  {/* Element Details (Right on MD+, Bottom on SM) */}
                  <div className="w-full md:w-[60%] lg:w-[65%] p-1 md:p-2 order-2 md:order-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-xs sm:text-sm md:text-base bg-black/40 p-3 sm:p-4 rounded-lg border border-gray-800/70 mb-4">
                      <div><span className="font-semibold text-gray-400">Atomic Number:</span> {activeElement.atomicNumber}</div>
                      <div><span className="font-semibold text-gray-400">Atomic Mass:</span> {activeElement.atomicMass} amu</div>
                      <div className="sm:col-span-2"><span className="font-semibold text-gray-400">Category:</span> <span className="font-medium">{activeElement.category}</span></div>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}