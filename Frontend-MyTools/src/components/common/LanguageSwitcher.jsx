import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);

const languages = [
    { code: "en", countryCode: "US" },
    { code: "fr", countryCode: "FR" },
    { code: "ar", countryCode: "MA" } // or "SA"
];
const current =
    languages.find(l => i18n.language.startsWith(l.code)) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27]"
            >
                <ReactCountryFlag
                    countryCode={current.countryCode}
                    svg
                    style={{ width: "24px", height: "24px" }}
                />

                <ChevronDown size={14} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-[#2d2a27] rounded-xl shadow-xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setOpen(false);
                            }}
                            className="w-full flex justify-center p-3 hover:bg-[#f5f5f3] dark:hover:bg-[#383530]"
                        >
                            <ReactCountryFlag
                                countryCode={lang.countryCode}
                                svg
                                style={{ width: "20px", height: "20px" }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}