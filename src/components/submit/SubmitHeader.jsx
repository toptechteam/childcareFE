import React, { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/config/urls";

const BRAND_FALLBACK_LOGO =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/1c51a949d_1.png";

export default function SubmitHeader({ center, parentName, childName, promptText }) {
  const resolvedCenterLogo = resolveMediaUrl(center?.logo_url);
  const [centerLogoFailed, setCenterLogoFailed] = useState(false);
  const [brandLogoFailed, setBrandLogoFailed] = useState(false);

  useEffect(() => {
    setCenterLogoFailed(false);
    setBrandLogoFailed(false);
  }, [resolvedCenterLogo]);

  const logoAlt = center?.center_name?.trim()
    ? `Logo for ${center.center_name.trim()}`
    : "Childcare Stories";

  const showCenterLogo = Boolean(resolvedCenterLogo) && !centerLogoFailed;
  const showBrandLogo = !showCenterLogo && !brandLogoFailed;
  const showWordmark = !showCenterLogo && !showBrandLogo;

  return (
    <div className="text-center mb-12">
      {showCenterLogo ? (
        <img
          src={resolvedCenterLogo}
          alt={logoAlt}
          className="h-28 mx-auto mb-6 max-w-[min(100%,280px)] object-contain"
          onError={() => setCenterLogoFailed(true)}
        />
      ) : showBrandLogo ? (
        <img
          src={BRAND_FALLBACK_LOGO}
          alt="Childcare Stories"
          className="h-32 mx-auto mb-6 max-w-[min(100%,320px)] object-contain"
          onError={() => setBrandLogoFailed(true)}
        />
      ) : (
        <div className="min-h-[4.5rem] flex items-center justify-center mx-auto mb-6 rounded-2xl border border-gray-200 bg-white/90 px-6 py-4 shadow-sm max-w-md">
          <span className="text-xl md:text-2xl font-bold text-gray-900 text-center break-words">
            {center?.center_name?.trim() || "Childcare Stories"}
          </span>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
        Hi {parentName}!
      </h1>
      <p className="text-xl text-[#555555] mb-6">
        We'd love to hear about {childName}'s experience at {center?.center_name}
      </p>
      {/* {promptText && (
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
          <p className="text-lg text-[#555555] italic">"{promptText}"</p>
        </div>
      )} */}
    </div>
  );
}