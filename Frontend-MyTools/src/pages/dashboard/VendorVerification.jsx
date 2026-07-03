/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BadgeCheck, FileText, ShieldCheck, XCircle } from 'lucide-react';
import { vendorVerificationService } from '../../services/vendorVerificationService';
import { useKeycloak } from '../../providers/KeycloakProvider';

const emptyForm = { legalName: '', businessName: '', documentType: 'CIN', note: '' };

const VendorVerification = () => {
  const { isAdmin } = useKeycloak();
  const [mine, setMine] = useState(null);
  const [pending, setPending] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const own = await vendorVerificationService.mine().catch(() => ({ data: null }));
      setMine(own.data || null);
      if (isAdmin) {
        const res = await vendorVerificationService.pending();
        setPending(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      setError(err?.response?.data || 'Unable to load verification data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [isAdmin]);

  const submit = async (e) => {
    e.preventDefault();
    if (!document) { setError('Please attach a document.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      await vendorVerificationService.submit(form, document);
      setForm(emptyForm); setDocument(null); setSuccess('Verification submitted successfully.');
      await load();
    } catch (err) {
      setError(err?.response?.data || 'Unable to submit verification.');
    } finally {
      setSaving(false);
    }
  };

  const review = async (id, status) => {
    await vendorVerificationService.review(id, status, status === 'APPROVED' ? 'Approved from admin panel' : 'Rejected from admin panel');
    await load();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><BadgeCheck /></div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Vendor Verification</h2>
          <p className="text-sm text-[#8a8580]">Submit and review seller verification requests</p>
        </div>
      </div>

      {loading ? <p>Loading verification...</p> : <>
        {mine && <div className="mb-6 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] p-4 border border-[#e8e7e5] dark:border-[#4a4642]">
          <p className="text-sm text-[#8a8580]">Latest request</p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-bold text-[#2d2a27] dark:text-white">{mine.businessName || mine.legalName}</h3>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1a1816] text-xs font-bold">{mine.status}</span>
          </div>
          {mine.reviewComment && <p className="mt-2 text-sm text-[#8a8580]">Admin comment: {mine.reviewComment}</p>}
        </div>}

        <form onSubmit={submit} className="space-y-3 mb-8 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} placeholder="Legal name" className="rounded-xl border p-3 bg-transparent" />
            <input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business name" className="rounded-xl border p-3 bg-transparent" />
            <select value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })} className="rounded-xl border p-3 bg-transparent">
              <option value="CIN">CIN</option>
              <option value="TRADE_REGISTER">Trade register</option>
              <option value="TAX_ID">Tax ID</option>
            </select>
            <input required type="file" onChange={(e) => setDocument(e.target.files?.[0] || null)} className="rounded-xl border p-3 bg-transparent" />
          </div>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Optional note" className="w-full rounded-xl border p-3 bg-transparent" />
          <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d2842] text-white text-sm"><FileText size={16} /> {saving ? 'Submitting...' : 'Submit verification'}</button>
        </form>

        {error && <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}
        {success && <div className="mb-4 rounded-xl bg-green-50 text-green-700 p-3">{success}</div>}

        {isAdmin && <div>
          <h3 className="text-xl font-bold mb-3 text-[#2d2a27] dark:text-white">Pending admin reviews</h3>
          {pending.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No pending verifications.</div> :
            <div className="space-y-3">{pending.map((v) => <div key={v.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]">
              <div className="flex justify-between gap-3 flex-wrap"><div><p className="font-bold">{v.businessName}</p><p className="text-sm text-[#8a8580]">{v.legalName} · {v.documentType}</p></div><span className="text-xs">{v.createdAt && new Date(v.createdAt).toLocaleDateString()}</span></div>
              <div className="flex gap-2 mt-3"><button onClick={() => review(v.id, 'APPROVED')} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-green-600 text-white text-xs"><ShieldCheck size={14} /> Approve</button><button onClick={() => review(v.id, 'REJECTED')} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-600 text-white text-xs"><XCircle size={14} /> Reject</button></div>
            </div>)}</div>}
        </div>}
      </>}
    </div>
  );
};

export default VendorVerification;
