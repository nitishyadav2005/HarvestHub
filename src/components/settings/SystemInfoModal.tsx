import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { db } from '../../db';
import { Database, Layers, Download, Upload, CheckCircle2, Server, Code } from 'lucide-react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = async () => {
    const data = {
      fields: await db.fields.toArray(),
      crops: await db.crops.toArray(),
      cropRotations: await db.cropRotations.toArray(),
      operations: await db.operations.toArray(),
      expenses: await db.expenses.toArray(),
      yields: await db.yields.toArray(),
      exportedAt: new Date().toISOString()
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `harvesthub_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.fields && parsed.crops) {
            await db.transaction(
              'rw',
              [db.fields, db.crops, db.cropRotations, db.operations, db.expenses, db.yields],
              async () => {
                await db.fields.clear();
                await db.crops.clear();
                await db.cropRotations.clear();
                await db.operations.clear();
                await db.expenses.clear();
                await db.yields.clear();

                await db.fields.bulkAdd(parsed.fields);
                await db.crops.bulkAdd(parsed.crops);
                if (parsed.cropRotations) await db.cropRotations.bulkAdd(parsed.cropRotations);
                if (parsed.operations) await db.operations.bulkAdd(parsed.operations);
                if (parsed.expenses) await db.expenses.bulkAdd(parsed.expenses);
                if (parsed.yields) await db.yields.bulkAdd(parsed.yields);
              }
            );
            setImportStatus('Data imported successfully into IndexedDB!');
            onRefreshData();
          } else {
            setImportStatus('Invalid JSON backup file structure.');
          }
        } catch (err) {
          setImportStatus('Failed to parse JSON file.');
        }
      };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System Architecture & Storage Specs"
      subtitle="IndexedDB local database metrics & Spring Boot REST API readiness"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-emerald-950">
        {/* Active Database Banner */}
        <div className="p-4 rounded-2xl bg-[#d8f3dc] border border-[#74c69d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2d6a4f] text-white">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#1b4332]">IndexedDB Engine (Active)</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                  Local Browser DB
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Client-side transactional database storing all farm records persistently.
              </p>
            </div>
          </div>
        </div>

        {/* IndexedDB Object Stores */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#2d6a4f]" /> Active Object Stores
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { name: 'fields', desc: 'Plot size, soil & crop' },
              { name: 'crops', desc: 'Master crop catalog' },
              { name: 'cropRotations', desc: 'Sequence & N balance' },
              { name: 'operations', desc: 'Sowing, spray & harvest' },
              { name: 'expenses', desc: 'Input costs & wages' },
              { name: 'yields', desc: 'Harvest sales & Mandi revenue' }
            ].map((store) => (
              <div key={store.name} className="p-2.5 rounded-xl bg-white border border-emerald-100">
                <div className="font-bold text-[#1b4332] text-xs font-mono">{store.name}</div>
                <div className="text-[11px] text-emerald-700">{store.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Spring Boot Integration Roadmap Card */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1b4332]">
            <Server className="w-4 h-4 text-[#2d6a4f]" /> Future Java / Spring Boot Backend Integration
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            The frontend application is built using a clean <strong className="text-[#1b4332]">Repository Service Pattern</strong> (<code className="bg-emerald-100 px-1 rounded">IFieldService</code>, <code className="bg-emerald-100 px-1 rounded">ICropService</code>, etc.).
          </p>
          <div className="p-3 rounded-xl bg-[#f8faf8] border border-emerald-100 font-mono text-[11px] text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Code className="w-3.5 h-3.5 text-[#2d6a4f]" /> Modular Abstraction Mapping:
            </div>
            <div>• <strong className="text-[#1b4332]">Frontend Interface:</strong> <span className="text-emerald-700">src/services/fieldService.ts</span></div>
            <div>• <strong className="text-[#1b4332]">IndexedDB Adapter:</strong> <span className="text-emerald-700">IndexedDBFieldService (Dexie)</span></div>
            <div>• <strong className="text-[#1b4332]">Spring Boot Adapter:</strong> <span className="text-[#2d6a4f]">SpringRestFieldService (Axios / Fetch to /api/v1/fields)</span></div>
          </div>
          <p className="text-[11px] text-emerald-800">
            Swapping from local IndexedDB to a Spring Boot backend only requires creating the REST adapter class and changing 1 export in the service layer!
          </p>
        </div>

        {/* JSON Export / Import Actions */}
        <div className="p-4 rounded-2xl bg-[#e8f5e9] border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-[#1b4332]">Backup & Restore Local Data</h5>
            <p className="text-[11px] text-emerald-800">Export IndexedDB stores as JSON file or import a backup.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="clay-btn-secondary text-xs py-1.5 px-3"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>

            <label className="clay-btn-primary text-xs py-1.5 px-3 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {importStatus}
          </div>
        )}
      </div>
    </Modal>
  );
};
