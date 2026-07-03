import { useEffect, useState } from 'react';
import { ListTree, Pencil, Trash2 } from 'lucide-react';
import { lookupService } from '../../services/lookupService';
import { invalidateLookupCache } from '../../hooks/useLookups';

const emptyForm = { type: '', code: '', value: '', isActive: true };

const LookupAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await lookupService.list();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setError(err?.response?.data || 'Unable to load lookups.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, isActive: Boolean(form.isActive) };
    if (editing) await lookupService.update(editing, payload);
    else await lookupService.create(payload);
    invalidateLookupCache(); setForm(emptyForm); setEditing(null); await load();
  };

  const edit = (item) => { setEditing(item.id); setForm({ type: item.type || '', code: item.code || '', value: item.value || '', isActive: item.isActive ?? item.active ?? true }); };
  const remove = async (id) => { await lookupService.remove(id); invalidateLookupCache(); await load(); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gradient-to-br from-[#b8862f] to-[#d4a343] rounded-2xl text-white"><ListTree /></div><div><h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Lookups</h2><p className="text-sm text-[#8a8580]">Manage categories, marks, conditions and listing types</p></div></div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 rounded-2xl p-4 bg-[#f5f5f3] dark:bg-[#2d2a27]"><input required value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} placeholder="Type" className="rounded-xl border p-3 bg-transparent"/><input required value={form.code} onChange={(e)=>setForm({...form,code:e.target.value})} placeholder="Code" className="rounded-xl border p-3 bg-transparent"/><input required value={form.value} onChange={(e)=>setForm({...form,value:e.target.value})} placeholder="Value" className="rounded-xl border p-3 bg-transparent"/><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e)=>setForm({...form,isActive:e.target.checked})}/> Active</label><button className="rounded-xl bg-[#6d2842] text-white font-semibold">{editing ? 'Update' : 'Create'}</button></form>
      {error && <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}
      {loading ? <p>Loading lookups...</p> : items.length === 0 ? <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No lookup values yet.</div> : <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-[#8a8580]"><th className="p-3">Type</th><th className="p-3">Code</th><th className="p-3">Value</th><th className="p-3">Active</th><th className="p-3">Actions</th></tr></thead><tbody>{items.map((item)=><tr key={item.id} className="border-t border-[#e8e7e5] dark:border-[#4a4642]"><td className="p-3">{item.type}</td><td className="p-3">{item.code}</td><td className="p-3">{item.value}</td><td className="p-3">{String(item.isActive ?? item.active)}</td><td className="p-3 flex gap-2"><button onClick={()=>edit(item)} className="p-2 rounded-lg bg-white dark:bg-[#1a1816]"><Pencil size={14}/></button><button onClick={()=>remove(item.id)} className="p-2 rounded-lg bg-red-50 text-red-600"><Trash2 size={14}/></button></td></tr>)}</tbody></table></div>}
    </div>
  );
};

export default LookupAdmin;
