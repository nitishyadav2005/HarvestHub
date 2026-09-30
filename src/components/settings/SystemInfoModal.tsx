import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { db } from '../../db';
import { Database, Layers, Download, Upload, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
  onResetSeedData?: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  onResetSeedData
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
      equipment: await db.equipment.toArray(),
      maintenance: await db.maintenance.toArray(),
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
              [
                db.fields,
                db.crops,
                db.cropRotations,
                db.operations,
                db.expenses,
                db.yields,
                db.equipment,
                db.maintenance
              ],
              async () => {
                await db.fields.clear();
                await db.crops.clear();
                await db.cropRotations.clear();
                await db.operations.clear();
                await db.expenses.clear();
                await db.yields.clear();
                await db.equipment.clear();
                await db.maintenance.clear();

                await db.fields.bulkAdd(parsed.fields);
                await db.crops.bulkAdd(parsed.crops);
                if (parsed.cropRotations) await db.cropRotations.bulkAdd(parsed.cropRotations);
                if (parsed.operations) await db.operations.bulkAdd(parsed.operations);
                if (parsed.expenses) await db.expenses.bulkAdd(parsed.expenses);
                if (parsed.yields) await db.yields.bulkAdd(parsed.yields);
                if (parsed.equipment) await db.equipment.bulkAdd(parsed.equipment);
                if (parsed.maintenance) await db.maintenance.bulkAdd(parsed.maintenance);
              }
            );
            setImportStatus('Data imported successfully into IndexedDB!');
            onRefreshData();
          } else {
            setImportStatus('Invalid JSON backup file structure.');
          }
        } catch (err) {
          console.error('Import error:', err);
          setImportStatus('Failed to parse JSON file.');
        }
      };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Farm Journal Data & Storage"
      subtitle="Green Valley Farm local IndexedDB database metrics & backup management"
      maxWidth="2xl"
    >
      <div className="space-y-4 sm:space-y-6 text-xs text-emerald-950 min-w-0">
        {/* Active Database Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#d8f3dc] border border-[#74c69d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#2d6a4f] text-white shrink-0">
              <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm sm:text-base font-bold text-[#1b4332] truncate">IndexedDB Engine (Active)</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-white shrink-0">
                  Local Browser DB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-800 mt-0.5 break-words">
                Client-side transactional database storing all Green Valley Farm records persistently.
              </p>
            </div>
          </div>
        </div>

        {/* IndexedDB Object Stores */}
        <div className="space-y-2 min-w-0">
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#2d6a4f] shrink-0" /> Active Object Stores
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'fields', desc: '4 farm plots' },
              { name: 'crops', desc: 'Crop varieties' },
              { name: 'cropRotations', desc: 'Rotation plans' },
              { name: 'operations', desc: 'Field activities' },
              { name: 'expenses', desc: 'Input expenses' },
              { name: 'yields', desc: 'Harvest sales' },
              { name: 'equipment', desc: 'Machinery fleet' },
              { name: 'maintenance', desc: 'Service logs' }
            ].map((store) => (
              <div key={store.name} className="p-2 sm:p-2.5 rounded-xl bg-white border border-emerald-100 min-w-0">
                <div className="font-bold text-[#1b4332] text-xs font-mono truncate">{store.name}</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-700 truncate">{store.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Farm Journal Architecture Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-200 space-y-2.5 min-w-0">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1b4332]">
            <ShieldCheck className="w-4 h-4 text-[#2d6a4f] shrink-0" /> Offline-First Farm Journal & Data Privacy
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed break-words">
            HarvestHub operates entirely on-device using high-performance <strong className="text-[#1b4332]">IndexedDB</strong> storage. All Green Valley Farm plot measurements, crop schedules, field operations, financials, and equipment service logs remain private and persistent in your browser without requiring an active internet connection.
          </p>
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#f8faf8] border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              • Complete offline field logging capability
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              • Instant transactional data reads and writes
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              • Full JSON backup and restore support
            </div>
          </div>
        </div>

        {/* JSON Export / Import Actions */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#e8f5e9] border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <h5 className="font-bold text-[#1b4332] text-sm">Backup & Restore Local Data</h5>
            <p className="text-[11px] text-emerald-800">Export IndexedDB stores as JSON file or import a backup.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onResetSeedData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetSeedData();
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#1b4332] border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                title="Populate 4 consistent test datasets across all modules"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" /> Seed 4 Records
              </button>
            )}

            <button
              onClick={handleExportJSON}
              className="clay-btn-secondary text-xs py-1.5 px-3 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>

            <label className="clay-btn-primary text-xs py-1.5 px-3 cursor-pointer whitespace-nowrap">
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
