import Daytime from "@/components/daytime/daytime";
import TaskItem from "@/components/tasks/TaskItem";

export default function Main() {
    return (
        <div>
            <h1>Main</h1>
            <Daytime />
            <div className="flex border border-black">
                <div className="flex flex-col">
                    <h1>Today</h1>
                    <TaskItem />
                </div>
            </div>
        </div>
    )   
}