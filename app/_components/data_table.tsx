"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Column,
    ColumnDef,
    ColumnResizeDirection,
    ColumnResizeMode,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { CSSProperties, useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

// const getCommonPinningStyles = (column: any): CSSProperties => {
//     const isPinned = column.getIsPinned()
//     const isLastLeftPinnedColumn =
//       isPinned === 'left' && column.getIsLastColumn('left')
//     const isFirstRightPinnedColumn =
//       isPinned === 'right' && column.getIsFirstColumn('right')

//     return {
//       boxShadow: isLastLeftPinnedColumn
//         ? '-4px 0 4px -4px gray inset'
//         : isFirstRightPinnedColumn
//           ? '4px 0 4px -4px gray inset'
//           : undefined,
//       left: `${column.getStart('left')}px`,
//       opacity: isPinned ? 0.95 : 1,
//       position: isPinned ? 'fixed' : 'relative',
//       width: column.getSize(),
//       zIndex: isPinned ? 1 : 0,
//     }
//   }
const getCommonPinningStyles = (column: any): CSSProperties => {
    // const {column} = header;
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn = column.getIsLastColumn('left')

    return {
        boxShadow: isLastLeftPinnedColumn
            && '-4px 0 4px -4px gray inset',

        // left: `${column.getStart('left')-2}px`,
        left: `${column.id === 'isSelected' ? "-2" : "70"}px`,
        backgroundColor: 'white',
        opacity: isPinned ? 1 : 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        // borderRight: isPinned && '2px solid red',
        zIndex: isPinned ? 1 : 0,
    }
}


export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({})

    // check which row is selected currently
    // useEffect(()=>{
    //     console.log(rowSelection);
    // }, [rowSelection]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // select row features
        state: {
            rowSelection: rowSelection
        },

        enableColumnPinning: true,
        initialState: {
            columnPinning: { left: ['isSelected', 'id'] },
        },

        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        enableMultiRowSelection: false,
        // column resize features
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,

    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable
    // completed all


    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table {...{
                    className: 'border border-gray-200',
                    style: {
                        width: table.getTotalSize(),
                    }
                }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ ...getCommonPinningStyles(header.column) }}
                                        >
                                            <div className="flex justify-between">

                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),

                                                    )

                                                }
                                                <div
                                                    {...{
                                                        onDoubleClick: () => header.column.resetSize(),
                                                        onMouseDown: header.getResizeHandler(),
                                                        onTouchStart: header.getResizeHandler(),
                                                        className: `resizer ${table.options.columnResizeDirection
                                                            } ${header.column.getIsResizing() ? 'isResizing' : ''
                                                            }flex cursor-col-resize border-2 border-gray-600 hover:border-blue-600`,
                                                        style: {
                                                            transform:
                                                                table.options.columnResizeMode === 'onEnd' &&
                                                                    header.column.getIsResizing()
                                                                    ? `translateX(${(table.options.columnResizeDirection ===
                                                                        'rtl'
                                                                        ? -1
                                                                        : 1) *
                                                                    (table.getState().columnSizingInfo
                                                                        .deltaOffset ?? 0)
                                                                    }px)`
                                                                    : '',
                                                        },
                                                    }}
                                                ></div>
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id} // Ensure cell.id is unique for each Cell element
                                            style={{ ...getCommonPinningStyles(cell.column) }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
