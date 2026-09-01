const $ = (id) => document.getElementById(id);
const controls = [
  ['tls', 'TLS 1.3 encrypted channel', 27, 'Encryption blocks readable in-transit data.'],
  ['pinning', 'Certificate pinning', 22, 'The app rejects an impostor certificate.'],
  ['signed', 'Signed payment request', 18, 'Request tampering becomes detectable.'],
  ['mfa', 'UPI PIN / device approval', 15, 'Payment completion needs user authentication.']
];
function formatINR(value) { return '₹' + Number(value || 0).toLocaleString('en-IN'); }
function setVisualRisk(score) {
  const meter = $('meter'); const offset = 301.6 * (1 - score / 100);
  meter.style.strokeDashoffset = offset;
  const grade = score < 30 ? 'low' : score < 62 ? 'medium' : 'high';
  meter.style.stroke = grade === 'low' ? '#b7ff4d' : grade === 'medium' ? '#ffad4d' : '#ff7272';
  $('score').textContent = score;
  const labels = { low: 'LOW EXPOSURE', medium: 'ELEVATED EXPOSURE', high: 'HIGH EXPOSURE' };
  $('riskLabel').textContent = labels[grade]; $('riskLabel').className = `risk-label ${grade}`;
  const summaries = {
    low: 'Layered controls substantially limit interception and modification opportunities.',
    medium: 'Some safeguards are missing. An untrusted network increases the value of a fake endpoint.',
    high: 'The payment path has weak trust signals. Avoid continuing until the network and protections are restored.'
  }; $('riskSummary').textContent = summaries[grade];
  $('statusPill').textContent = grade === 'low' ? 'Protected path' : grade === 'medium' ? 'Controls incomplete' : 'Unsafe configuration';
  $('statusPill').className = `status-pill ${grade === 'low' ? 'secure' : grade === 'medium' ? 'warning' : 'critical'}`;
}
function runSimulation() {
  const network = $('network'); const signal = $('signal');
  let score = Number(network.value) + Number(signal.value) + Number($('deviceTrust').value) + Number($('paymentTime').value);
  if (!$('vpn').checked) score += 8;
  if (!$('warningSeen').checked) score += 7;
  controls.forEach(([id,, reduction]) => { if (!$(id).checked) score += reduction; });
  score = Math.max(4, Math.min(98, score));
  $('payerNode').textContent = $('payer').value || 'Payer'; $('payeeNode').textContent = $('payee').value || 'Payee';
  $('paymentLine').textContent = `${$('payer').value || 'Payer'} → ${$('payee').value || 'Payee'}`;
  $('amountLine').textContent = formatINR($('amount').value); $('riskZoneText').textContent = network.options[network.selectedIndex].text;
  const weak = score >= 62; $('interceptor').classList.toggle('vulnerable', weak);
  setVisualRisk(score);
  const list = $('controlList'); list.innerHTML = controls.map(([id, name,, detail]) => `<li><i class="${$(id).checked ? 'pass' : 'fail'}">${$(id).checked ? '✓' : '×'}</i><span><strong>${name}</strong><br>${$(id).checked ? detail : 'Not enabled — protection gap.'}</span></li>`).join('');
  const missing = controls.filter(([id]) => !$(id).checked).map(([,name]) => name);
  const drivers = [];
  if (Number(network.value) >= 18) drivers.push('Shared / public network');
  if (Number(signal.value) >= 5) drivers.push('Untrusted connection state');
  if (Number($('deviceTrust').value) >= 6) drivers.push('Device trust not managed');
  if (Number($('paymentTime').value) >= 5) drivers.push('Unusual payment time');
  if (!$('vpn').checked) drivers.push('No trusted VPN');
  if (!$('warningSeen').checked) drivers.push('Network warning ignored');
  missing.forEach(name => drivers.push(`${name} off`));
  $('riskDrivers').innerHTML = (drivers.length ? drivers : ['No material risk driver detected']).map(d => `<span class="driver ${drivers.length ? '' : 'safe'}">${d}</span>`).join('');
  const decision = $('decisionBox');
  decision.textContent = score < 30 ? '✓ Continue only after verifying the payee name and UPI ID in your app.' : score < 62 ? '△ Pause and use mobile data or a trusted network; turn on every missing control first.' : '× Stop this simulated payment. Do not enter a PIN on this path—switch to mobile data or a known trusted network.';
  decision.className = `decision-box ${score < 30 ? 'go' : score < 62 ? 'caution' : 'stop'}`;
  const channel = $('tls').checked ? 'A TLS-protected session is requested and certificate validity is checked.' : 'No encrypted transport protection is modeled for this session.';
  const trace = [
    `<strong>Scenario initialized.</strong> ${$('payer').value || 'Payer'} prepares a fictional ${formatINR($('amount').value)} request in ${$('paymentApp').value}.`,
    `<strong>Recipient check.</strong> Intended recipient: ${$('payee').value || 'Payee'} · ${$('payeeVpa').value || 'No UPI ID entered'}.`,
    `<strong>Network context assessed.</strong> ${network.options[network.selectedIndex].text} · ${signal.options[signal.selectedIndex].text}.`,
    `<strong>Channel evaluation.</strong> ${channel}`,
    `<strong>Integrity evaluation.</strong> ${$('signed').checked ? 'The request carries an integrity check.' : 'The request has no modeled tamper-evidence layer.'}`,
    `<strong>Authorization evaluation.</strong> ${$('mfa').checked ? 'User confirmation is required before completion.' : 'No second confirmation barrier is modeled.'}`,
    `<strong>Outcome.</strong> ${score < 30 ? 'Interception attempts are strongly constrained.' : score < 62 ? 'Risk is measurable; restore the missing controls before paying.' : 'Do not proceed on this configuration. Switch networks and enable all controls.'}${missing.length ? ` Missing: ${missing.join(', ')}.` : ''}`
  ]; $('trace').innerHTML = trace.map(item => `<li>${item}</li>`).join('');
  const packet = $('packet'); packet.classList.remove('animate'); void packet.offsetWidth; packet.classList.add('animate');
  $('requestState').textContent = 'Simulation complete · no real payment sent';
}
function reset() { $('payer').value='Aarav'; $('payee').value='Nisha Stores'; $('payerVpa').value='aarav@bank'; $('payeeVpa').value='nisha.stores@bank'; $('amount').value=1250; $('deviceTrust').value=6; $('paymentApp').selectedIndex=1; $('paymentTime').value=5; $('network').value=28; $('signal').value=5; $('vpn').checked=false; $('warningSeen').checked=true; controls.forEach(([id]) => $(id).checked=true); runSimulation(); }
$('runBtn').addEventListener('click', runSimulation); $('resetBtn').addEventListener('click', reset);
document.querySelectorAll('input,select').forEach(el => el.addEventListener('change', runSimulation));
runSimulation();
