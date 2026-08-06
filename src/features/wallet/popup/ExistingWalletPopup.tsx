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
      className=""
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
