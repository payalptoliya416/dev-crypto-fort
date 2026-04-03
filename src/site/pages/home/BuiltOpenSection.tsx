import check from "@/assets/site/check.png";

export default function BuiltOpenSection() {
  const data = [
    {
      title: "Transparent by Design",
      desc: "Code is publicly accessible and continuously reviewed.",
    },
    {
      title: "Community Driven",
      desc: "Developers can contribute, improve, and audit freely.",
    },
    {
      title: "No Hidden Logic",
      desc: "Everything is visible nothing runs behind closed systems.",
    },
  ];

  return (
    <section className="bg-white pt-16 md:pt-[110px] pb-[240px] md:pb-[272px]">
      <div className="container-custom mx-auto">
        <h2 className="text-center text-3xl md:text-[40px] leading-[40px] font-extrabold text-[#25C866] mb-[15px]">
          Built
          <span className="text-[#262732]">in the Open</span>
        </h2>
        <p className="text-[#52535B] max-w-[732px] mx-auto text-lg font-semibold mb-[35px]">
          CryptosFort is fully open-source, allowing anyone to inspect, verify,
          and contribute to the system without hidden logic or centralized
          control.
        </p>

        {/* CARDS */}
        <div className="grid gap-[30px] md:grid-cols-2">
          {data.map((item, i) => (
            <div
              key={i}
              className="border border-[#E9E9EB] rounded-[20px] py-[15px] px-[15px] sm:px-[25px] flex items-start gap-[15px]"
            >
              {/* ICON */}
              <div className="shrink-0">
                <img src={check} alt="" className="w-6 h-6" />
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-xl font-bold mb-[10px] text-[#262732]">
                  {item.title}
                </h3>
                <p className="text-[#52535B] font-medium text-lg lg:leading-[18px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-10">
          <button className="bg-[#25C866] text-white px-[22px] py-3 rounded-[12px] text-lg leading-[18px] font-semibold hover:bg-[#22b35a] transition">
            View on GitHub
          </button>
        </div>
      </div>
    </section>
  );
}
