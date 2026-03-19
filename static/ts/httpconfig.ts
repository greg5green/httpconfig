interface RequestField {
  displayName: string;
  value: string | string[] | undefined;
}

type HttpConfigResponse = Record<string, RequestField>;

fetch('/api/httpconfig')
  .then((res) => res.json() as Promise<HttpConfigResponse>)
  .then((data) => {
    const table = document.createElement('table');
    table.className = 'container';

    for (const [key, field] of Object.entries(data)) {
      const row = table.insertRow();
      row.className = `result-${key}`;

      const propCell = row.insertCell();
      propCell.className = 'property';
      propCell.textContent = field.displayName;

      const valueCell = row.insertCell();
      valueCell.className = 'value';
      valueCell.textContent = String(field.value ?? '');
    }

    document.querySelector('header')!.insertAdjacentElement('afterend', table);
  });
