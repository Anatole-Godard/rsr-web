export default function TestPage(props) {
  return <pre>{JSON.stringify(JSON.parse(props.user), null, 2)}</pre>;
}

export const getServerSideProps = async (ctx) => {
  const { req, res } = ctx;

  const { cookies } = req;
  return {
    props: {
      ...cookies,
    },
  };
};
