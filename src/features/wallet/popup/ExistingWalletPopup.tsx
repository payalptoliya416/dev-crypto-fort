import ExistingWalletUI from "../components/ExistingWalletUI";

function ExistingWalletPopup({
  onSeedNext,
  onKeyNext,
    onClose,
}: {
  onSeedNext: () => void;
  onKeyNext: () => void;
  onClose: () => void;
}) {
  return (
     <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose} 
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ExistingWalletUI
          onSeedPhrase={onSeedNext}
          onPrivateKey={onKeyNext}
        />
      </div>
    </div>
  );
}

export default ExistingWalletPopup;
