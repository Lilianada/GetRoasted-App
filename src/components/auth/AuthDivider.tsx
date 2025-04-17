
const AuthDivider = ({ text }: { text: string }) => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-night-700" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-night px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
};

export default AuthDivider;
