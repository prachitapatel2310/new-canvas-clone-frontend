"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import nextDynamic from "next/dynamic";

// disable SSR for components that rely on Redux/hooks
const HelloRedux = nextDynamic(() => import("./HelloRedux"), { ssr: false });
const CounterRedux = nextDynamic(() => import("./CounterRedux"), { ssr: false });
const AddRedux = nextDynamic(() => import("./AddRedux"), { ssr: false });
const TodoList = nextDynamic(() => import("./todos/TodoList"), { ssr: false });

export default function ReduxExamples() {
    return (
        <div>
            <h2>Redux Examples</h2>
            <HelloRedux />
            <CounterRedux />
            <AddRedux />
            <TodoList />
        </div>
    );
}