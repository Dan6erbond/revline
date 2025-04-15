import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { signIn, useSession } from "next-auth/react";

import { Plus } from "lucide-react";
import Wordmark from "../components/wordmark";

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <Wordmark />
        </NavbarBrand>
        <NavbarContent>
          <NavbarItem>
            <Link aria-current="page" color="primary" href="#">
              Garage
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Maintenance
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Performance
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Gallery
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          {data !== null ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button onPress={() => signIn("zitadel")}>Sign in</Button>
          )}
        </NavbarContent>
      </Navbar>
      <main className="p-8">
        <div className="flex justify-end">
          <Button startContent={<Plus />}>Add Car</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>Toyota Supra</CardHeader>
            <CardBody>5000 HP</CardBody>
            <CardFooter>Sold</CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
