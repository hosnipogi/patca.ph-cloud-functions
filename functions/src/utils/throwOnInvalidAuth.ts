const pass = `Bearer ${process.env.SIMPLE_PASSWORD!}`;
export default function (auth: string | undefined) {
  if (!auth || auth !== pass) throw new Error("Invalid Password");
  return;
}
