import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

type LabelItem = { val: string; label: string };
type JsonContentType = {
  subject?: LabelItem[];
  var?: LabelItem[];
  turvar?: LabelItem[];
  vervar?: LabelItem[];
  tahun?: LabelItem[];
  datacontent: Record<string, string | number | null>;
};

// Fungsi untuk mengekstrak ID berdasarkan struktur kunci
function extract_ids(
  key: string,
  vervar_keys: string[],
  var_keys: string[],
  turvar_keys: string[],
  tahun_keys: string[]
): [string?, string?, string?, string?] {
  for (const vervar of vervar_keys) {
    if (key.startsWith(vervar)) {
      let key_remain = key.slice(vervar.length);

      for (const vari of var_keys) {
        if (key_remain.startsWith(vari)) {
          key_remain = key_remain.slice(vari.length);

          for (const turvar of turvar_keys) {
            if (key_remain.startsWith(turvar)) {
              key_remain = key_remain.slice(turvar.length);

              for (const tahun of tahun_keys) {
                if (key_remain.startsWith(tahun) && key_remain.endsWith("0")) {
                  return [vervar, vari, turvar, tahun];
                }
              }
            }
          }
        }
      }
    }
  }
  return [];
}

async function save_to_db(filename: string) {
  try {
    await prisma.files.create({
      data: {
        name: filename,
      },
    });

    return { status: 200 };
  } catch (error) {
    throw new Error(`Gagal memasukkan nama file ke basis data ${error}`)
  }
}

export async function convertJsonToCsvAndSave(
  jsonContent: JsonContentType,
  originalName?: string
): Promise<{ filename: string; filePath: string; success: boolean }> {
  try {
    const baseName =
      originalName?.replace(/\.json$/i, "") || `converted_${uuidv4()}`;
    const filename = `${baseName}.csv`;

    const subject_label = jsonContent?.subject?.[0]?.label || "-";
    const var_label = jsonContent?.var?.[0]?.label || "-";

    const turvar_labels: Record<string, string> = {};
    jsonContent.turvar?.forEach((item: any) => {
      turvar_labels[item.val] = item.label.replace("Tidak ada", "-");
    });

    const vervar_labels: Record<string, string> = {};
    jsonContent.vervar?.forEach((item: any) => {
      vervar_labels[item.val] = item.label.replace("Tidak ada", "-");
    });

    const tahun_labels: Record<string, string> = {};
    jsonContent.tahun?.forEach((item: any) => {
      tahun_labels[item.val] = item.label.replace("Tidak ada", "-");
    });

    const datacontent = jsonContent.datacontent || {};

    const vervar_keys = Object.keys(vervar_labels).sort(
      (a, b) => b.length - a.length
    );
    const var_keys = jsonContent.var?.map((v: any) => v.val.toString()) || [];
    const turvar_keys = Object.keys(turvar_labels).sort(
      (a, b) => b.length - a.length
    );
    const tahun_keys = Object.keys(tahun_labels).sort(
      (a, b) => b.length - a.length
    );

    const rows = [
      [
        "label_subject",
        "label_vervar",
        "label_var",
        "label_turvar",
        "label_tahun",
        "nilai",
      ],
    ];

    for (const [key, value] of Object.entries(datacontent)) {
      if (value !== null && value !== undefined) {
        const [vervar, vari, turvar, tahun] = extract_ids(
          key,
          vervar_keys,
          var_keys,
          turvar_keys,
          tahun_keys
        );

        if (vervar && vari && turvar && tahun) {
          rows.push([
            subject_label,
            vervar_labels[vervar],
            var_label,
            turvar_labels[turvar],
            tahun_labels[tahun],
            value.toString(),
          ]);
        }
      }
    }

    // const filename = `converted_${uuidv4()}.csv`;
    const filePath = path.join("/tmp", filename);
    const csvContent = rows
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");

    await fs.writeFile(filePath, csvContent, "utf-8");

    await save_to_db(filename);

    return { filename, filePath, success: true };
  } catch (err) {
    console.error("Gagal konversi:", err);
    return { filename: "failed.csv", filePath: "", success: false };
  }
}
