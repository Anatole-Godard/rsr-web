const title = ({ name }) => <h1>{name}</h1>;

export default function Page() {
  return <>{title({ name: "jj" })}</>;
}
