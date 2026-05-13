import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Calculator, Download, Droplets, Leaf, FlaskConical, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PlantAge = 'Year 1' | 'Year 2' | 'Mature';

export default function NutrientCalculator() {
  const [poles, setPoles] = useState<number | ''>('');
  const [age, setAge] = useState<PlantAge>('Year 1');

  // Standard organic farming data (per pole per month)
  const standards = {
    'Year 1': { manure: 0.8, npk: 100, micro: 20, description: 'Growth Phase' },
    'Year 2': { manure: 1.25, npk: 150, micro: 30, description: 'Pre-Fruiting' },
    'Mature': { manure: 1.6, npk: 200, micro: 50, description: 'Production Phase' },
  };

  const poleCount = Number(poles) || 0;
  const results = {
    manure: (standards[age].manure * poleCount).toFixed(1),
    npk: (standards[age].npk * poleCount / 1000).toFixed(2), // kg
    micro: (standards[age].micro * poleCount).toFixed(0), // grams
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(46, 125, 50); // Farm Green
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Adarsh Dragon Fruit Farm', 20, 20);
    doc.setFontSize(12);
    doc.text('Monthly Nutrient Feeding Schedule', 20, 30);
    
    // Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Plant Age: ${age} (${standards[age].description})`, 20, 55);
    doc.text(`Total Poles: ${poleCount}`, 20, 62);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 69);
    
    // Table Header
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 80, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Nutrient Type', 25, 87);
    doc.text('Monthly Requirement', 120, 87);
    
    // Rows
    doc.setFont('helvetica', 'normal');
    let y = 100;
    const rows = [
      ['Cow Manure', `${results.manure} kg`],
      ['NPK (16-16-16)', `${results.npk} kg`],
      ['Micronutrients', `${results.micro} g`],
    ];
    
    rows.forEach(row => {
      doc.text(row[0], 25, y);
      doc.text(row[1], 120, y);
      doc.line(20, y + 3, 190, y + 3);
      y += 15;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Note: These are estimates based on organic standards. Adjust based on local soil tests.', 20, 160);
    doc.text('Adarsh Farm Platform - Digital Agriculture Companion', 20, 165);
    
    doc.save(`Feeding_Schedule_${age}_${poleCount}_Poles.pdf`);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-farm-green to-cactus p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-6 h-6" />
          <h2 className="text-2xl font-bold tracking-tight">Nutrient Calculator</h2>
        </div>
        <p className="text-soft-green/80 text-sm">Calculate precise feeding schedules for your farm.</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Total Poles</label>
              <input 
                type="number"
                value={poles}
                onChange={(e) => setPoles(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 500"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-cactus/10 font-bold text-lg border border-transparent focus:border-cactus transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Plant Age</label>
              <div className="flex flex-col gap-3">
                {(['Year 1', 'Year 2', 'Mature'] as PlantAge[]).map((pAge) => (
                  <button
                    key={pAge}
                    onClick={() => setAge(pAge)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      age === pAge 
                      ? 'border-cactus bg-cactus/5 text-gray-900 shadow-sm' 
                      : 'border-gray-50 text-gray-400 hover:border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${age === pAge ? 'bg-cactus text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Leaf size={16} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{pAge}</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 font-black">{standards[pAge].description}</p>
                      </div>
                    </div>
                    {age === pAge && <CheckCircle2 className="text-cactus" size={20} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <FileText size={16} />
                Monthly Requirements
              </h3>
              
              <div className="space-y-4">
                <ResultItem icon={<Droplets />} label="Cow Manure" value={results.manure} unit="kg" />
                <ResultItem icon={<FlaskConical />} label="NPK 16-16-16" value={results.npk} unit="kg" />
                <ResultItem icon={<Droplets className="rotate-180" />} label="Micronutrients" value={results.micro} unit="g" />
              </div>
            </div>

            <button
              onClick={downloadPDF}
              disabled={!poles}
              className={`mt-10 w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                poles 
                ? 'bg-gray-900 text-white shadow-xl hover:scale-[1.02] active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download size={20} />
              <span>Download PDF Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultItem({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string, unit: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-soft-green text-cactus rounded-xl">
          {icon}
        </div>
        <span className="font-bold text-gray-600">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-2xl font-black text-gray-900">{value}</span>
        <span className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">{unit}</span>
      </div>
    </div>
  );
}
