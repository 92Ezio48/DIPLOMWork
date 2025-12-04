import MainContainer from "@/components/MainContainer/MainContainer";
export default function RootLayout({ children }) {
  return (
    <>
      <MainContainer />
      {children}
    </>
  );
}
