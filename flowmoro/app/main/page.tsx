import Daytime from "@/components/daytime/daytime";
import TaskItem from "@/components/tasks/TaskItem";

export default function Main() {
    return (
        <div className="w-full">
            <Daytime />
            <div className="flex justify-center">
                <TaskItem />
            </div>
        </div>
    )
}