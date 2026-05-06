# Complaints Compliance Notes

Updated: 6 May 2026

AgentDock should not claim to make customers compliant.

It should claim something narrower and useful:

```text
AgentDock tracks complaint clocks, evidence gaps, approval status, and escalation risk so managers can act before deadlines become surprises.
```

## FCA Complaint Timers

For FCA-regulated complaints:

- Complaints resolved by the close of the third business day after receipt follow the summary resolution communication route.
- Standard complaints normally need a final response within 8 weeks.
- Payment services and e-money complaints normally need a final response within 15 business days, with an outer 35-business-day limit where exceptional delay is explained.
- Final responses should explain referral rights to the Financial Ombudsman Service where applicable.

Sources:

- FCA DISP 1.5 complaint resolution rules: https://www.handbook.fca.org.uk/handbook/DISP/1/5.html
- FCA DISP 1.6 complaints time limits: https://www.handbook.fca.org.uk/handbook/DISP/1/6.html
- FCA payment services complaint handling: https://www.handbook.fca.org.uk/handbook/DISP/1/6.html

## Telecom Complaint Timers

For telecom-style service operations:

- UK telecom complaints can escalate toward ADR after 8 weeks or once the provider issues a deadlock letter.
- Irish communications providers operate under complaint-handling requirements set by ComReg and must publish complaint-handling codes of practice.
- Telecom complaint handling often involves billing, service quality, contracts, complaint handling, and connectivity issues.

Sources:

- Ofcom complaints guidance: https://www.ofcom.org.uk/make-a-complaint/complain-about-mobile-phone-or-internet-services
- Ofcom ADR scheme guidance: https://www.ofcom.org.uk/phones-and-broadband/service-quality/adr-schemes/
- ComReg complaints: https://www.comreg.ie/advice-information/complaints/

## Glide-Style Operator Context

Use Glide only as market context, not as a customer claim.

Glide is a UK managed connectivity provider serving sectors such as student accommodation, build-to-rent, business, later living, hospitality, and construction. Their public positioning emphasises broadband, managed Wi-Fi, private networks, and large-scale managed connectivity.

This is the right style of buyer environment for AgentDock:

- Many properties and customers
- Mixed support and field operations
- Billing disputes and credits
- SLA pressure
- Complaint handling
- Repeat contacts
- Multiple internal teams touching one customer issue

Sources:

- Glide homepage: https://glide.co.uk/
- Glide sectors: https://glide.co.uk/sectors/

## Product Rules

- Track complaint age by source system.
- Surface regulator-relevant timers only where configured.
- Keep jurisdiction explicit: FCA, Ofcom, ComReg, internal SLA, or customer contract.
- Never auto-send a final response.
- Route financial redress, credits, deadlock letters, and final responses through Review Gate.
- Log who approved what, when, and from which evidence.

