const Header = () => {
  return (
    <div className="w-full py-8 px-[4.5rem] flex justify-between items-center self-stretch">
      <img
        src={"icons/CtruhTryOnLogoBlack.svg"}
        alt="Logo"
        className="h-12 w-auto"
      />
      <div className="flex justify-end items-center gap-4 text-[16px]">
        <button className="py-2 px-[18px] font-semibold font-metropolis leading-[27px]">
          Visit CTRUH
        </button>
        <div
          className="py-3 px-5 rounded-2xl border-[2px] border-tryon-black text-white font-semibold font-metropolis"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.00) 100%), #1A1A1A",
            boxShadow: "0px 1.6px 25.6px 0px rgba(255, 255, 255, 0.50)",
          }}
        >
          Book a FREE Demo
        </div>
      </div>
    </div>
  );
};

export default Header;
