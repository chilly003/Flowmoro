import TimeClient from "./TimeClient";

type Params = { taskId: string };

export default async function Page({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const resolved = await Promise.resolve(params);
  const taskId = Number(resolved.taskId);

  return <TimeClient taskId={taskId} />;
}