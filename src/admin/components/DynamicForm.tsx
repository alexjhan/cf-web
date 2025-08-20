import React, { useState } from 'react';

export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'multiselect' | 'file';
  options?: { value: string; label: string }[]; // for select / multiselect
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  maxLength?: number;
  className?: string;
  accept?: string; // for file
}

export interface DynamicFormProps<T extends Record<string, any>> {
  fields: FieldConfig[];
  value: T;
  onChange: (patch: Partial<T>) => void;
  onSubmit: () => Promise<any> | void;
  submitLabel?: string;
  disabled?: boolean;
  layout?: 'one-column' | 'two-columns';
  busyLabel?: string;
  error?: string | null;
}

// Reusable form component for admin CRUD pages
export default function DynamicForm<T extends Record<string, any>>({
  fields,
  value,
  onChange,
  onSubmit,
  submitLabel = 'Guardar',
  disabled,
  layout = 'one-column',
  busyLabel = 'Guardando...',
  error
}: DynamicFormProps<T>) {
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (name: string, val: any) => {
    onChange({ [name]: val } as Partial<T>);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const gridClass = layout === 'two-columns' ? 'grid md:grid-cols-2 gap-4' : 'flex flex-col gap-4';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && <div className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded p-2">{error}</div>}
      <div className={gridClass}>
        {fields.map(f => {
          const common = {
            name: f.name,
            id: f.name,
            required: f.required,
            maxLength: f.maxLength,
            placeholder: f.placeholder,
            disabled: disabled || submitting,
            className: `bg-gray-800/70 px-3 py-2 rounded-lg border border-gray-700 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 outline-none transition text-sm w-full placeholder-gray-500 ${f.className || ''}`
          } as const;
          const val = (value as any)[f.name] ?? '';
          return (
            <label key={f.name} className="group flex flex-col gap-1 text-[11px] font-semibold tracking-wide text-gray-300">
              <span className="uppercase text-[10px] font-bold text-[#FFD700]/90 group-focus-within:text-[#FFD700] transition">{f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}</span>
              {f.type === 'textarea' ? (
                <div className="relative w-full flex flex-col">
                  <textarea
                    {...common}
                    value={val}
                    onChange={e => handleFieldChange(f.name, e.target.value)}
                    className={common.className + ' min-h-28 resize-y'}
                  />
                </div>
              ) : f.type === 'select' ? (
                <select {...common} value={val} onChange={e => handleFieldChange(f.name, e.target.value)} className={common.className + ' cursor-pointer'}>
                  <option value="" disabled>{f.placeholder || 'Seleccione...'}</option>
                  {(f.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'multiselect' ? (
                <select {...common} multiple value={Array.isArray(val)? val: []} onChange={e=> {
                  const selected = Array.from(e.target.selectedOptions).map(o=> o.value);
                  handleFieldChange(f.name, selected);
                }} className={common.className + ' h-32 cursor-pointer'}>
                  {(f.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'file' ? (
                <div className="flex flex-col gap-2">
                  <input
                    id={f.name}
                    name={f.name}
                    type="file"
                    accept={f.accept || 'image/*'}
                    disabled={disabled || submitting}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#FFD700]/20 file:text-[#FFD700] file:font-semibold file:tracking-wide file:text-xs hover:file:bg-[#FFD700]/30 cursor-pointer"
                    onChange={e=> {
                      const file = e.target.files?.[0];
                      if(!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleFieldChange(f.name, reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {val && typeof val === 'string' && val.startsWith('data:') && (
                    <img src={val} alt="preview" className="max-h-32 rounded border border-gray-700 object-cover" />
                  )}
                </div>
              ) : (
                <input {...common} type={f.type || 'text'} value={val} onChange={e => handleFieldChange(f.name, e.target.value)} />
              )}
              {f.helperText && <span className="text-[10px] text-gray-500 tracking-wide">{f.helperText}</span>}
            </label>
          );
        })}
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={disabled || submitting} className="px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-black font-semibold rounded-md text-sm tracking-wide shadow hover:from-[#FFD700] hover:to-[#FFE066] disabled:opacity-60 disabled:cursor-not-allowed transition">
          {submitting ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
