import React, { useContext, useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MessageSquare, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FetchChatContext } from "@/Context/MessagesContext";
import { ChatContactsContext } from "@/Context/chatContactsContext";
import { SearchInput } from "../Searchinput/SearchInput";

export const columns = [
  {
    accessorKey: "avatar",
    cell: ({ row, table }) => {
      const { onlineStatus } = table.options.meta;
      const status = onlineStatus.find((user) => user._id === row.original._id);
      const curretnSatus = status?.isOnline ? "bg-green-600" : "bg-red-600";
      return (
        <div className="relative">
          <img
            src={row.getValue("avatar")}
            className="rounded-full"
            width={30}
            height={30}
          />
          <p
            className={`absolute w-2 h-2 rounded-full left-7 bottom-0 ${curretnSatus}`}
          ></p>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const { name, email } = row.original;
      return (
        <div className="lowercase">
          <p className="text-base">{name}</p>
          <p className="text-xs text-gray-400">{email}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Star size={20} className="mr-3" />
              Favorite
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>mute</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "unreadCount",
    cell: ({ row, table }) => {
      const { userGotNewMessage } = table.options.meta;
      const contactId = row.original._id;
      const unread = userGotNewMessage?.[contactId] || 0;

      return unread > 0 ? (
        <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-black font-semibold rounded-full">
          {unread}
        </span>
      ) : null;
    },
  },
];

export function ChatlistTable() {
  const { chatContacts } = useContext(ChatContactsContext);
  const { setSelectedUserId, userGotNewMessage } = useContext(FetchChatContext);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [onlineStatus, setOnlineStatus] = useState([]);

  useEffect(() => {
    const currentOnlineStatus = () => {
      const statusData = chatContacts?.map((contacts) => ({
        _id: contacts._id,
        isOnline: contacts.isOnline,
      }));
      setOnlineStatus(statusData);
    };
    currentOnlineStatus();
  }, [chatContacts]);

  const table = useReactTable({
    data: chatContacts,
    columns,
    meta: { userGotNewMessage, onlineStatus },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <SearchInput />
      {/* favorite table */}
      {/* <div className="flex items-center py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center">
                <Star size={20} className="mr-3" />
                Favorites
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedUserId(row.original._id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No favorites.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center">
                <MessageSquare size={20} className="mr-3" />
                Chats
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedUserId(row.original._id)}
                  className="hover:bg-gray-200 cursor-pointer transition-all druation-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
