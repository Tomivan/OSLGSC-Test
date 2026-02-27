import { VoteProvider } from "../context/VoteContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <VoteProvider>
      {children}
    </VoteProvider>
  );
}