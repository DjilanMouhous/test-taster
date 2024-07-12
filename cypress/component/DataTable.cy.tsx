import React from "react";
import { DataTable } from "../../src/feat/user-list/data-table";
import { columns } from "../../src/feat/user-list/columns";
import { UserListFixture } from "../../src/feat/user-list/types.fixture";

import "../../src/App.scss";

describe("DataTable.cy.tsx", () => {
  it("can mount", () => {
    cy.mount(<DataTable columns={columns} data={UserListFixture} />);
  });
  it("has 6 columns", () => {
    cy.mount(<DataTable columns={columns} data={UserListFixture} />);
    cy.get("thead th").should("have.length", 6);
  });
  it(`has ${UserListFixture.length} row`, () => {
    cy.mount(<DataTable columns={columns} data={UserListFixture} />);
    cy.get("tbody tr").should("have.length", UserListFixture.length);
  });
  it("display a message when there is no data", () => {
    cy.mount(<DataTable columns={columns} data={[]} />);
    cy.get("tbody tr").should("have.length", 1);
    cy.get("tbody tr td").should("have.text", "No results.");
  });
});
