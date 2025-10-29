import React from "react";

export default function SubmitHeader({ center, parentName, childName, promptText }) {
  return (
    <div className="text-center mb-12">
      {center?.logo_url ? (
        <img src={center.logo_url} alt="Centre logo" className="h-28 mx-auto mb-6" />
      ) : (
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/1c51a949d_1.png" 
          alt="Childcare Stories" 
          className="h-32 mx-auto mb-6"
        />
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
        Hi {parentName}!
      </h1>
      <p className="text-xl text-[#555555] mb-6">
        We'd love to hear about {childName}'s experience at {center?.center_name}
      </p>
      {promptText && (
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
          <p className="text-lg text-[#555555] italic">"{promptText}"</p>
        </div>
      )}
    </div>
  );
}