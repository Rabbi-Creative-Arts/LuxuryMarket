"use client";

import { useState } from "react";

import {
  approvePartnerApplication,
  rejectPartnerApplication,
  reviewPartnerApplication,
  suspendPartnerApplication,
} from "../actions/partner-application.actions";

interface PartnerApplication {
  id: string;

  partnerType:
    | "PERSONAL"
    | "POPULAR";

  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "SUSPENDED";

  businessName: string;

  brandName: string;

  email: string;

  phone: string;

  firstName: string;

  lastName: string;

  position: string | null;

  website: string | null;

  description: string;

  productType: string;

  country: string;

  city: string;

  purchaseUrl: string | null;

  affiliateNetwork: string | null;

  commissionInformation:
    | string
    | null;

  reviewerNotes: string | null;

  submittedAt: Date;
}

interface Props {
  applications: PartnerApplication[];
}

export default function PartnerApplicationTable({
  applications,
}: Props) {
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const selectedApplication =
    applications.find(
      (application) =>
        application.id === selectedId
    );

  async function handleAction(
    action:
      | "APPROVE"
      | "REJECT"
      | "REVIEW"
      | "SUSPEND"
  ) {
    if (!selectedId) {
      return;
    }

    try {
      setLoading(true);

      if (action === "APPROVE") {
        await approvePartnerApplication(
          selectedId,
          notes
        );
      }

      if (action === "REJECT") {
        await rejectPartnerApplication(
          selectedId,
          notes
        );
      }

      if (action === "REVIEW") {
        await reviewPartnerApplication(
          selectedId,
          notes
        );
      }

      if (action === "SUSPEND") {
        await suspendPartnerApplication(
          selectedId,
          notes
        );
      }

      setSelectedId(null);
      setNotes("");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(
    date: Date
  ) {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  }

  function statusClasses(
    status: PartnerApplication["status"]
  ) {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";

      case "REJECTED":
        return "bg-red-100 text-red-800";

      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800";

      case "SUSPENDED":
        return "bg-gray-200 text-gray-800";

      default:
        return "bg-yellow-100 text-yellow-800";
    }
  }

  return (
    <div className="space-y-6">
      {/* ============================================
          Summary
          ============================================ */}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Applications
          </p>

          <p className="mt-2 text-3xl font-bold">
            {applications.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Personal Brands
          </p>

          <p className="mt-2 text-3xl font-bold">
            {
              applications.filter(
                (item) =>
                  item.partnerType ===
                  "PERSONAL"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Popular Brands
          </p>

          <p className="mt-2 text-3xl font-bold">
            {
              applications.filter(
                (item) =>
                  item.partnerType ===
                  "POPULAR"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold">
            {
              applications.filter(
                (item) =>
                  item.status ===
                  "PENDING"
              ).length
            }
          </p>
        </div>
      </div>

      {/* ============================================
          Applications Table
          ============================================ */}

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">
                  Brand
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Type
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Applicant
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Location
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Submitted
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    No partner applications
                    have been submitted yet.
                  </td>
                </tr>
              ) : (
                applications.map(
                  (application) => (
                    <tr
                      key={application.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold">
                            {
                              application.brandName
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            {
                              application.businessName
                            }
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            application.partnerType ===
                            "PERSONAL"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-black text-white"
                          }`}
                        >
                          {application.partnerType ===
                          "PERSONAL"
                            ? "Personal Brand"
                            : "Popular Brand"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium">
                          {
                            application.firstName
                          }{" "}
                          {
                            application.lastName
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          {
                            application.email
                          }
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {
                          application.city
                        }
                        ,{" "}
                        {
                          application.country
                        }
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                            application.status
                          )}`}
                        >
                          {application.status.replace(
                            "_",
                            " "
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(
                          application.submittedAt
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(
                              application.id
                            );

                            setNotes(
                              application.reviewerNotes ??
                                ""
                            );
                          }}
                          className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================
          Review Panel
          ============================================ */}

      {selectedApplication && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Partner Application
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {
                  selectedApplication.brandName
                }
              </h2>

              <p className="mt-1 text-gray-500">
                {
                  selectedApplication.partnerType ===
                  "PERSONAL"
                    ? "Personal Brand"
                    : "Popular Brand"
                }
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setNotes("");
              }}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Close
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Business Name
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.businessName
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Applicant
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.firstName
                }{" "}
                {
                  selectedApplication.lastName
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.email
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.phone
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Country
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.country
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                City
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.city
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Product Type
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.productType
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Website
              </p>

              <p className="mt-1 font-medium">
                {
                  selectedApplication.website ||
                  "Not provided"
                }
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap leading-7">
              {
                selectedApplication.description
              }
            </p>
          </div>

          {selectedApplication.partnerType ===
            "POPULAR" && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-5">
              <h3 className="font-semibold">
                Popular Brand / Affiliate
                Information
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <strong>
                    Purchase URL:
                  </strong>{" "}
                  {selectedApplication.purchaseUrl ||
                    "Not provided"}
                </p>

                <p>
                  <strong>
                    Affiliate Network:
                  </strong>{" "}
                  {selectedApplication.affiliateNetwork ||
                    "Not provided"}
                </p>

                <p>
                  <strong>
                    Commission:
                  </strong>{" "}
                  {selectedApplication.commissionInformation ||
                    "Not provided"}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="reviewerNotes"
              className="mb-2 block text-sm font-medium"
            >
              Admin Notes
            </label>

            <textarea
              id="reviewerNotes"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Add internal review notes..."
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleAction("APPROVE")
              }
              className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : "Approve"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleAction("REVIEW")
              }
              className="rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              Under Review
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleAction("REJECT")
              }
              className="rounded-lg border border-red-600 px-5 py-3 font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Reject
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleAction("SUSPEND")
              }
              className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              Suspend
            </button>
          </div>
        </div>
      )}
    </div>
  );
}