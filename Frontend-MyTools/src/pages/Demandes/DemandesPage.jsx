import { useEffect, useState } from "react";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { demandeService } from "../../services/demandeService";
import { useKeycloak } from "../../providers/KeycloakProvider";

const emptyForm = { title: "", typeId: 1, price: 0, description: "" };

const DemandesPage = () => {
  const { authenticated, login, user, isAdmin } = useKeycloak();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await demandeService.list();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data || t("demandes.unableToLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canModifyDemande = (item) => {
    if (!authenticated) return false;
    if (isAdmin) return true;
    return item.ownerId === user?.id;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!authenticated) {
      login();
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        typeId: Number(form.typeId),
        price: Number(form.price),
        ownerId: user?.id,
      };
      if (editing) await demandeService.update(editing, payload);
      else await demandeService.create(payload);
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err?.response?.data || t("demandes.unableToSave"));
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      typeId: item.typeId || 1,
      price: item.price || 0,
      description: item.description || "",
    });
  };
  const remove = async (id) => {
    if (!authenticated) {
      login();
      return;
    }
    await demandeService.remove(id);
    await load();
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816] py-12">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-[#6d2842] text-white">
            <ClipboardList />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#2d2a27] dark:text-white">
              {t("demandes.title")}
            </h1>
            <p className="text-[#8a8580]">{t("demandes.subtitle")}</p>
          </div>
        </div>
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 rounded-2xl bg-white dark:bg-[#2d2a27] p-4 border border-[#e8e7e5] dark:border-[#4a4642]">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t("demandes.requestTitle")}
            className="rounded-xl border p-3 bg-transparent md:col-span-2"
          />
          <input
            required
            min="1"
            type="number"
            value={form.typeId}
            onChange={(e) => setForm({ ...form, typeId: e.target.value })}
            placeholder={t("demandes.type")}
            className="rounded-xl border p-3 bg-transparent"
          />
          <input
            required
            min="0"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder={t("demandes.budget")}
            className="rounded-xl border p-3 bg-transparent"
          />
          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d2842] text-white font-semibold disabled:opacity-60">
            <Plus size={16} />
            {editing ? t("demandes.update") : t("demandes.create")}
          </button>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t("demandes.description")}
            className="md:col-span-5 rounded-xl border p-3 bg-transparent"
          />
        </form>
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3">
            {error}
          </div>
        )}
        {loading ? (
          <p>{t("demandes.loading")}</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#2d2a27] rounded-2xl">
            {t("demandes.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white dark:bg-[#2d2a27] p-5 border border-[#e8e7e5] dark:border-[#4a4642]">
                <h3 className="font-bold text-lg text-[#2d2a27] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8a8580] mt-1 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm px-3 py-1 rounded-full bg-[#f5f5f3] dark:bg-[#1a1816]">
                    {t("demandes.typeLabel")} {item.typeId}
                  </span>
                  <strong>{Number(item.price || 0).toFixed(2)} MAD</strong>
                </div>
                <div className="flex gap-2 mt-4">
                  {canModifyDemande(item) && (
                    <>
                      <button
                        onClick={() => edit(item)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#f5f5f3] dark:bg-[#1a1816] text-sm">
                        <Pencil size={14} /> {t("demandes.edit")}
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm">
                        <Trash2 size={14} /> {t("demandes.delete")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandesPage;
