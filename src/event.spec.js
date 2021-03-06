const { makeNewEvent } = require('./event')
const { api } = require('./api')

describe('event', () => {
  describe('makeNewEvent', () => {
    beforeEach(() => {
      api.request.mockResolvedValueOnce({ organizers: [{ id: 'organizerId' }] })
    })

    it('should create event with the right time (summer time UTC+2)', async () => {
      const meetup = getMeetup({ date: '20/06/2019' })
      const createNewEventForOrganization = makeNewEvent(meetup)
      const expectedDates = getExpectedDates('2019-06-20T17:00:00Z', '2019-06-20T20:00:00Z')

      await createNewEventForOrganization('organizationId')

      expectRequestToHaveBeenCalledWithDates(api.request, expectedDates)
    })

    it('should create event with the right time (winter time UTC+1)', async () => {
      const meetup = getMeetup({ date: '21/02/2019' })
      const createNewEventForOrganization = makeNewEvent(meetup)
      const expectedDates = getExpectedDates('2019-02-21T18:00:00Z', '2019-02-21T21:00:00Z')

      await createNewEventForOrganization('organizationId')

      expectRequestToHaveBeenCalledWithDates(api.request, expectedDates)
    })
  })
})

function getExpectedDates(startUTC, endUTC) {
  const timezone = 'Europe/Paris'

  return JSON.stringify({
    start: { timezone, utc: startUTC },
    end: { timezone, utc: endUTC },
  }).replace(/^{|}$/g, '')
}

function expectRequestToHaveBeenCalledWithDates(request, expectedDates) {
  expect(request).toHaveBeenCalledWith(
    `/organizations/organizationId/events/`,
    expect.objectContaining({ body: expect.stringContaining(expectedDates) }),
  )
}

function getMeetup(overrideMeetup) {
  const meetup = {
    venue: { id: 'venueId', name: 'My venue' },
    sponsor: { id: 'sponsorId', name: 'My sponsor', link: 'sponsor.link' },
    talks: [],
  }

  return { ...meetup, ...overrideMeetup }
}

jest.mock('./api')
