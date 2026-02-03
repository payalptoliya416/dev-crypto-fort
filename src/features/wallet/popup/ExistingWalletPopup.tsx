import ExistingWalletUI from "../components/ExistingWalletUI";

function ExistingWalletPopup({
  onSeedNext,
  onKeyNext,
}: {
  onSeedNext: () => void;
  onKeyNext: () => void;
}) {
  return (
    <ExistingWalletUI
      onSeedPhrase={onSeedNext}
      onPrivateKey={onKeyNext}
    />
  );
}

export default ExistingWalletPopup;
