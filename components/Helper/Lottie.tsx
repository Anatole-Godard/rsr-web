import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

export const Animation = ({ data }: { data: any }) => {
  return (
    <Lottie
      style={{
        cursor: "default",
      }}
      isClickToPauseDisabled
      options={{
        loop: true,
        autoplay: true,
        animationData: data,
        rendererSettings: {
          hideOnTransparent: true,
        },
      }}
    />
  );
};
